# Sistema de gestión FPQRS para entidades financieras y cooperativas. Registre, asigne y cierre casos con trazabilidad completa y control de SLA.

Solución frontend desarrollada bajo los lineamientos técnicos solicitados para el proceso de selección en Estrategia Segura S.A.S.

## 🚀 Tecnologías Utilizadas
* **HTML5 & CSS3:** Estructuración semántica y estilización personalizada.
* **Bootstrap 5 (v5.3.3):** Framework para el diseño responsive y componentes base.
* **jQuery (v3.7.1):** Manipulación del DOM y lógica de interacción dinámica.
* **Lucide Icons:** Iconografía vectorial integrada vía CDN.
* **Google Fonts:** Tipografía "Plus Jakarta Sans".

## 📂 Estructura del Proyecto
GESTOR-FPQRS/
├── assets/
│   └── img/             # Recursos gráficos y logotipos
├── css/
│   └── styles.css       # Estilos globales y adaptaciones para cada vista
├── js/
│   ├── main.js          # Lógica de navegación y funcionalidades para cada vista
│   └── mockData.js      # Datos estáticos para simulación funcional
├── views/
│   ├── case-detail.html
│   ├── case-inbox.html
│   ├── fpqrs-registration-form.html
│   └── login.html
└── index.html           # Punto de entrada

## 🛠️ Instrucciones de Ejecución
Descomprimir el archivo .zip.

Abrir index.html en un navegador moderno.

Se recomienda el uso de la extensión "Live Server" en VS Code para una correcta carga de las rutas relativas.


Consideraciones de Implementación
He priorizado la fidelidad visual y la correcta estructura de los componentes principales. No obstante, deseo informar que en las vistas case-detail.html y fpqrs-registration-form.html, algunas funcionalidades específicas y detalles estéticos de alta fidelidad no alcanzan el 100% de los requerimientos de la UI original debido a los tiempos de ejecución establecidos para esta prueba. La base técnica y la estructura están listas para ser completadas, y con un margen de tiempo adicional, dichas vistas alcanzarán la fidelidad absoluta solicitada en el prototipo.

➕ PLUS: Se implementó compatibilidad para dispositivos móviles más precisamente para las vista: case-inbox.html y case-detail.html las cuales no contaban con buena responsividad mobile.