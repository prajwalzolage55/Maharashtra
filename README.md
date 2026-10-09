# Maharashtra: Unity in Diversity 2026

A comprehensive, interactive, and responsive web portal built to showcase the rich cultural heritage, history, geography, and modern infrastructure of Maharashtra state. 

This project was built as an exhibition portal for the **Department of Artificial Intelligence & Data Science** to demonstrate web development, interactive user interfaces, and mobile-first responsive design.

## 🚀 Live Demo (Local)
To run the website locally, you can use any static HTTP server. For example, using Python:
```bash
python -m http.server 8000
```
Then open `http://localhost:8000` in your web browser.

## ✨ Features

### 🎨 Design & UI
- **Fully Responsive (Mobile-First):** Carefully crafted CSS media queries support viewports from 4K desktop monitors down to 320px mobile screens.
- **Glassmorphism & Modern CSS:** Uses CSS Variables, modern grid/flex layouts, CSS filters, and backdrop-blurs.
- **Dark/Light Mode:** Full theming support with a toggle button that dynamically changes CSS variables across the entire site.
- **Bilingual Support (i18n):** Real-time English and Marathi translation via JavaScript and JSON data files, without reloading the page.

### 🗺️ Interactive Components
- **Dynamic Leaflet Map:** Features an interactive geographical map of Maharashtra with pins highlighting specific regions like Konkan, Vidarbha, Marathwada, and Western Maharashtra. Toggles between satellite and street view.
- **Analytics Dashboard:** Uses `Chart.js` to display interactive charts (e.g., Engineering/AI Growth, Economy Distribution).
- **Rule-based FAQ Chatbot:** An embedded floating chatbot that can answer common questions regarding Maharashtra's tourism, culture, and economy.
- **Interactive Quiz:** A JavaScript-powered knowledge quiz to test users on facts about the state.
- **3D Flip Cards:** CSS-only flip animations for the "At a glance" facts.
- **Smooth Image Carousel:** A continuous scrolling carousel for Forts and Heritage Sites.

## 📁 Project Structure

```
Maharashtra/
├── index.html           # Main HTML structure
├── sw.js                # Service Worker for offline caching
├── css/
│   └── style.css        # Main stylesheet (1,100+ lines of responsive CSS)
├── js/
│   ├── main.js          # Core logic (Carousel, Mobile Nav, Timeline, Theme)
│   ├── map.js           # Leaflet Map integration
│   ├── charts.js        # Chart.js configuration
│   ├── chatbot.js       # FAQ rule-based Chatbot logic
│   ├── i18n.js          # Localization script (English/Marathi)
│   └── quiz.js          # Knowledge Quiz logic
├── data/
│   ├── en.json          # English translation strings
│   ├── mr.json          # Marathi translation strings
│   ├── faq.json         # Chatbot intent/response rules
│   └── quiz.json        # Quiz questions and answers
└── images/              # Curated and compressed project images
```

## 🛠️ Built With

- **HTML5 & CSS3** (Vanilla, no frameworks like Tailwind/Bootstrap used)
- **Vanilla JavaScript** (ES6+)
- **Leaflet.js** (Maps)
- **Chart.js** (Data Visualization)
- **Service Workers** (PWA offline capabilities)

## 📱 Mobile Responsiveness

The application is thoroughly optimized for all mobile devices with custom breakpoints at:
- `≤ 768px` (Tablets)
- `≤ 600px` (Large Phones)
- `≤ 480px` (Small Phones/iPhone SE)

It includes touch-optimized interactive elements, horizontal scrolling pills for regions and categories, and a fullscreen mobile hamburger navigation menu.

## 👥 Department
Developed by the **Department of Artificial Intelligence & Data Science Project Team**.
