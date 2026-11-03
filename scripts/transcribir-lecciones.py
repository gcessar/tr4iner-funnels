#!/opt/homebrew/opt/python@3.14/bin/python3.14
"""Transcribe el audio de las lecciones de la Ruta Tr4iner (videos de R2) para el chat.

El agente del chat responde dudas de una lección con lo que dice el video, así que el
texto tiene que ser LITERAL: lo que dice Anthoni, sin resumir ni corregir. Lo único que
este script decide es dónde cortar los párrafos (por las pausas del audio), para que se
pueda leer.

Se transcribe en esta Mac con Whisper (mlx-whisper, modelo large-v3-turbo): no hace
falta ninguna clave y el audio no sale a otro servicio. Cada lección tiene una versión
por sexo y, según la lección, por tramo de edad o por días de entrenamiento; se
transcriben todas y las que dicen exactamente lo mismo comparten el texto.

Uso (desde la raíz del repo del funnel):
  scripts/transcribir-lecciones.py                       # baja, transcribe y arma el JSON
  scripts/transcribir-lecciones.py --solo ruta-dieta     # una lección
  scripts/transcribir-lecciones.py --armar               # sólo rearma el JSON con lo ya transcrito

Es reanudable: no vuelve a bajar ni a transcribir lo que ya está en --trabajo.
El mapa de versiones y el catálogo salen del CRM publicado (src/lib/genesis-lesson-videos.json
y src/lib/genesis-preview-catalog.json en origin/main de ~/crm-ventas, sin importar en qué
rama esté ese checkout: hacer `git fetch` allá antes). Cuando se suba una lección nueva a
R2, se corre de nuevo y sólo se transcribe lo nuevo.
"""
import argparse
import hashlib
import json
import os
import re
import subprocess
import sys
from datetime import date

R2 = 'https://video.mediatr4iner.com/'
# La regla WAF de R2 rechaza los pedidos sin el origen del sitio.
REFERER = 'https://metodo.tr4iner.com/'
# El audio de 360p (AAC a ~100 kbps) sobra para la voz y es el archivo más liviano.
ARCHIVO = 'play_360p.mp4'
MODELO = 'mlx-community/whisper-large-v3-turbo'
# Vocabulario para que Whisper escriba bien la marca y los términos que se repiten. No
# cambia lo que se dice: sólo cómo se escriben esas palabras cuando aparecen.
PROMPT_INICIAL = ('Hola, soy Anthoni Montalván, de TR4INER. En tu Ruta Tr4iner hablamos de entrenamiento con pesas, '
                  'sobrecarga progresiva, repeticiones, series, macros, proteína, carbohidratos, grasas, déficit calórico, '
                  'ciclo menstrual, fase folicular y fase lútea.')
# Pausa (segundos) a partir de la cual se empieza un párrafo nuevo, si el que va ya tiene
# algo de largo; y largo a partir del cual se corta en el próximo punto aunque no haya pausa.
PAUSA_PARRAFO = 1.0
PALABRAS_MIN = 35
PALABRAS_MAX = 130

CRM = os.path.expanduser('~/crm-ventas')

# Whisper oye la marca como la palabra inglesa: «Ruta Trainer», «el método trainer» (y una
# vez «método trader»), «Anthony». Es la misma palabra mal escrita, no otra: se corrige sólo
# la ortografía, y sólo al armar el JSON (el crudo de Whisper queda como salió). Revisado el
# 3-nov-2026 en las 50 versiones: todo «trainer» suelto es la marca.
ORTOGRAFIA = [
    (re.compile(r'\bm[ée]todo\s+trader\b', re.I), 'método TR4INER'),
    (re.compile(r'\bruta\s+trainer\b', re.I), 'Ruta Tr4iner'),
    (re.compile(r'\btrainer\b', re.I), 'TR4INER'),
    (re.compile(r'\bAnthony\b'), 'Anthoni'),
]


def argumentos():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument('--mapa', help='Archivo local en vez del de origin/main del CRM.')
    p.add_argument('--catalogo', help='Archivo local en vez del de origin/main del CRM.')
    p.add_argument('--trabajo', required=True, help='Carpeta para el audio y las transcripciones crudas (fuera del repo).')
    # Dentro de api/ porque Vercel no sirve esa carpeta como archivo estático (lib/ sí es público).
    p.add_argument('--salida', default='api/_ruta/transcripciones.json')
    p.add_argument('--solo', help='Slug de una sola lección (ruta-dieta).')
    p.add_argument('--armar', action='store_true', help='No transcribe: arma el JSON con lo que ya hay.')
    return p.parse_args()


def leer_json(local, ruta_en_crm):
    if local:
        with open(local, encoding='utf-8') as f:
            return json.load(f)
    return json.loads(subprocess.run(['git', '-C', CRM, 'show', 'origin/main:' + ruta_en_crm], check=True, capture_output=True).stdout)


def versiones(mapa, solo):
    for slug, leccion in mapa['lecciones'].items():
        if solo and slug != solo:
            continue
        for sexo, por_clave in leccion['versiones'].items():
            for clave, v in por_clave.items():
                yield slug, leccion.get('por', 'edad'), sexo, clave, v


def nombre_plano(carpeta):
    return carpeta.replace('/', '__')


def bajar_audio(carpeta, destino):
    if os.path.exists(destino) and os.path.getsize(destino) > 0:
        return
    tmp = destino + '.parcial.m4a'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-headers', 'Referer: ' + REFERER + '\r\n',
                    '-i', R2 + carpeta + '/' + ARCHIVO, '-vn', '-c:a', 'copy', tmp], check=True)
    os.replace(tmp, destino)


def transcribir(audio, destino):
    if os.path.exists(destino):
        return
    import mlx_whisper  # sólo hace falta para transcribir, no para --armar
    r = mlx_whisper.transcribe(audio, path_or_hf_repo=MODELO, language='es', initial_prompt=PROMPT_INICIAL,
                               # Sin arrastrar el texto anterior: evita que Whisper entre en un bucle
                               # repitiendo una frase en los videos largos.
                               condition_on_previous_text=False, verbose=False)
    crudo = {'modelo': MODELO, 'segmentos': [{'inicio': round(s['start'], 2), 'fin': round(s['end'], 2), 'texto': s['text']} for s in r['segments']]}
    with open(destino + '.parcial', 'w', encoding='utf-8') as f:
        json.dump(crudo, f, ensure_ascii=False, indent=1)
    os.replace(destino + '.parcial', destino)


def parrafos(segmentos):
    """Une los segmentos de Whisper en párrafos. No toca ninguna palabra: sólo decide
    dónde va un salto de párrafo (una pausa larga, o un punto cuando ya es largo)."""
    salida, actual, palabras, fin_anterior = [], [], 0, None
    for s in segmentos:
        t = s['texto'].strip()
        if not t:
            continue
        pausa = fin_anterior is not None and s['inicio'] - fin_anterior >= PAUSA_PARRAFO
        if actual and ((pausa and palabras >= PALABRAS_MIN) or (palabras >= PALABRAS_MAX and actual[-1][-1:] in '.?!')):
            salida.append(' '.join(actual))
            actual, palabras = [], 0
        actual.append(t)
        palabras += len(t.split())
        fin_anterior = s['fin']
    if actual:
        salida.append(' '.join(actual))
    texto = '\n\n'.join(salida)
    for patron, correcto in ORTOGRAFIA:
        texto = patron.sub(correcto, texto)
    return texto


def titulos(catalogo):
    t = {}
    for modulo in catalogo:
        for leccion in modulo['lessons']:
            ids = [x for x in (leccion.get('youtubeId'), leccion.get('videoKey'), leccion.get('previewYoutubeId')) if x]
            t['ruta-' + leccion['id']] = {'titulo': leccion['title'], 'modulo': modulo['title'], 'videoIds': ids,
                                          'edades': leccion.get('ageRanges', [])}
    return t


def armar(mapa, catalogo, trabajo, salida):
    info = titulos(catalogo)
    lecciones, textos, faltan = {}, {}, []
    for slug, por, sexo, clave, v in versiones(mapa, None):
        crudo = os.path.join(trabajo, 'crudo', nombre_plano(v['carpeta']) + '.json')
        if not os.path.exists(crudo):
            faltan.append(v['carpeta'])
            continue
        with open(crudo, encoding='utf-8') as f:
            texto = parrafos(json.load(f)['segmentos'])
        # Versiones que dicen exactamente lo mismo comparten el texto: el JSON no repite
        # siete horas de audio y la revisión se hace una sola vez.
        h = hashlib.sha256(texto.encode('utf-8')).hexdigest()[:12]
        textos[h] = texto
        l = lecciones.setdefault(slug, {
            'titulo': info.get(slug, {}).get('titulo', slug),
            'modulo': info.get(slug, {}).get('modulo', ''),
            'videoIds': info.get(slug, {}).get('videoIds', []),
            # Vacío = todas las edades (como en el catálogo del CRM).
            'edades': info.get(slug, {}).get('edades', []),
            'por': por,
            'versiones': {}
        })
        l['versiones'][v['carpeta']] = {'sexo': sexo, 'clave': clave, 'segundos': v['durationSec'], 'texto': h}
    datos = {
        'generado': date.today().isoformat(),
        'motor': MODELO + ' (mlx-whisper, en local)',
        'nota': 'Texto literal del audio de cada video. Los párrafos los corta el script por las pausas; las palabras son las de Whisper, sin corregir.',
        'lecciones': lecciones,
        'textos': textos
    }
    with open(salida, 'w', encoding='utf-8') as f:
        json.dump(datos, f, ensure_ascii=False, indent=1)
        f.write('\n')
    print('✓ %s: %d lecciones, %d versiones, %d textos distintos' % (salida, len(lecciones), sum(len(l['versiones']) for l in lecciones.values()), len(textos)))
    if faltan:
        print('Faltan %d versiones sin transcribir: %s' % (len(faltan), ', '.join(faltan)), file=sys.stderr)


def main():
    a = argumentos()
    mapa = leer_json(a.mapa, 'src/lib/genesis-lesson-videos.json')
    catalogo = leer_json(a.catalogo, 'src/lib/genesis-preview-catalog.json')
    os.makedirs(os.path.join(a.trabajo, 'audio'), exist_ok=True)
    os.makedirs(os.path.join(a.trabajo, 'crudo'), exist_ok=True)
    if not a.armar:
        lista = list(versiones(mapa, a.solo))
        for i, (slug, _, sexo, clave, v) in enumerate(lista, 1):
            plano = nombre_plano(v['carpeta'])
            audio = os.path.join(a.trabajo, 'audio', plano + '.m4a')
            crudo = os.path.join(a.trabajo, 'crudo', plano + '.json')
            print('[%d/%d] %s %s/%s (%d s)' % (i, len(lista), slug, sexo, clave, v['durationSec']), flush=True)
            bajar_audio(v['carpeta'], audio)
            transcribir(audio, crudo)
    armar(mapa, catalogo, a.trabajo, a.salida)


if __name__ == '__main__':
    main()
