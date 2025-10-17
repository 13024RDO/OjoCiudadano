from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/analyze-text', methods=['POST'])
def analyze_text():
    """
    Recibe una descripción de texto y devuelve un puntaje de prioridad simulado.
    """
    data = request.json
    description = data.get('description', '')
    
    # --- LÓGICA SIMULADA DEL MODELO NLP ---
    # Buscamos palabras clave para asignar una prioridad.
    priority_score = 1 # Prioridad BAJA por defecto
    reason = "Análisis de texto inicial: no se detectan palabras de alerta."
    
    urgent_keywords = ['arma', 'ayuda', 'robo', 'sangre', 'disparos', 'secuestro', 'violencia']
    medium_keywords = ['sospechoso', 'merodeando', 'discusion', 'vandalismo', 'accidente', 'ruidos']

    if any(word in description.lower() for word in urgent_keywords):
        priority_score = 3 # URGENTE
        reason = "Palabras clave de alta urgencia detectadas en el texto."
    elif any(word in description.lower() for word in medium_keywords):
        priority_score = 2 # MEDIO
        reason = "Actividad sospechosa o de riesgo medio detectada en el texto."
        
    print(f"Texto analizado: '{description[:30]}...' -> Prioridad: {priority_score}")
    return jsonify({'priority_score': priority_score, 'reason': reason})

# La función analyze_image ha sido eliminada ya que no se usa.

if __name__ == '__main__':
    # Ponemos a correr el servidor, accesible desde tu red local.
    app.run(host='0.0.0.0', port=5000)

