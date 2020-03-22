import 'https://api.mapbox.com/mapbox-gl-js/v1.8.1/mapbox-gl.js';

const getColorFromCases = confirmedCases => {
  if (confirmedCases >= 100) return '#de1738';
  if (confirmedCases >= 50) return '#f05e23';
  if (confirmedCases === 0) return '#50c878';
  return '#f9d71c';
};

const mapboxToken = 'secreto';

mapboxgl.accessToken = mapboxToken;

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v10',
  center: [-99.138611, 19.434167],
  zoom: 4,
});

map.addControl(new mapboxgl.NavigationControl());

fetch('./states.json')
  .then(response => response.json())
  .then(({ states, reports }) => {
    reports.forEach(({ placeId, confirmed, recovered, death }) => {
      const circle = document.createElement('div');
      circle.style.cssText = `width: 15px; height: 15px; background: ${getColorFromCases(
        confirmed
      )}; border-radius: 50%`;
      const { lng, lat, name } = states.find(({ id }) => id === placeId);
      var popup = new mapboxgl.Popup({
        className: 'my-class',
      })
        //ese set HTML no sé si se tenga que sanitizar o que pedo
        .setHTML(
          `
          <h3>${name}</h3>
        Confirmados: ${confirmed} <br/>
        Recuperados: ${recovered} <br />
        Defunctiones: ${death}
        `
        )
        .setMaxWidth('300px');

      var marker = new mapboxgl.Marker({
        element: circle,
      })
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map);
    });
  });

// fetch('./get-latest.json')
//   .then(response => response.json())
//   .then(data => {
//     // const { places, reports } = data;
//     // reports
//     //   .filter(({ hide }) => !hide)
//     //   .forEach(({ infected, placeId }) => {
//     //     const currentPlace = places.find(({ id }) => id === placeId);
//     //     console.log(infected, currentPlace);
//     //   });
//   });
