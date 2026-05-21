// ===================== evaluation_script.js =====================
//
// Structure des épreuves avec leurs compétences et pourcentages
// niveau : 0=rouge, 1=orange, 2=vert clair, 3=vert foncé
//
// E2  (coef épreuve 5) : C03 20%, C07 30%, C11 50%
// E31 (coef épreuve 5) : C06 25%, C09 50%, C10 25%
// E32 (coef épreuve 3) : C04 50%, C08 25%, C01 25%

const epreuves = {
  E2: {
    coefEpreuve: 5,
    competences: [
      { nom: "C03", pourcentage: 20, niveau: 0 },
      { nom: "C07", pourcentage: 30, niveau: 0 },
      { nom: "C11", pourcentage: 50, niveau: 0 }
    ]
  },
  E31: {
    coefEpreuve: 5,
    competences: [
      { nom: "C06", pourcentage: 25, niveau: 0 },
      { nom: "C09", pourcentage: 50, niveau: 0 },
      { nom: "C10", pourcentage: 25, niveau: 0 }
    ]
  },
  E32: {
    coefEpreuve: 3,
    competences: [
      { nom: "C04", pourcentage: 50, niveau: 0 },
      { nom: "C08", pourcentage: 25, niveau: 0 },
      { nom: "C01", pourcentage: 25, niveau: 0 }
    ]
  }
};

// Initialise l'affichage de toutes les épreuves au chargement
function init() {
  for (const idEpreuve in epreuves) {
    renderEpreuve(idEpreuve);
  }
  updateGlobal();
}

// Change le niveau d'une compétence et rafraîchit l'affichage
function setNiveau(idEpreuve, index, valeur) {
  epreuves[idEpreuve].competences[index].niveau = valeur;
  renderEpreuve(idEpreuve);
  updateGlobal();
}

// Recrée l'affichage HTML d'une épreuve
function renderEpreuve(idEpreuve) {
  const container = document.getElementById("competences-" + idEpreuve);
  container.innerHTML = "";

  const ep = epreuves[idEpreuve];
  ep.competences.forEach((comp, index) => {
    const val = comp.niveau;
    const div = document.createElement("div");
    div.className = "competence";

    div.innerHTML = `
      <span class="nom-competence">${comp.nom}</span>
      <span class="pct-competence">(${comp.pourcentage}%)</span>

      <div class="niveau rouge   ${val===0?'selected':''}" onclick="setNiveau('${idEpreuve}',${index},0)" title="Rouge"></div>
      <div class="niveau orange  ${val===1?'selected':''}" onclick="setNiveau('${idEpreuve}',${index},1)" title="Orange"></div>
      <div class="niveau vertClair ${val===2?'selected':''}" onclick="setNiveau('${idEpreuve}',${index},2)" title="Vert clair"></div>
      <div class="niveau vertFonce ${val===3?'selected':''}" onclick="setNiveau('${idEpreuve}',${index},3)" title="Vert foncé"></div>
    `;
    container.appendChild(div);
  });

  updateEpreuve(idEpreuve);
}

// Calcule et affiche les résultats d'une épreuve
function updateEpreuve(idEpreuve) {
  const ep = epreuves[idEpreuve];
  let rouge = 0, orange = 0, vertClair = 0, vertFonce = 0;
  let sommePonderee = 0;

  ep.competences.forEach(comp => {
    const n = comp.niveau;
    const poids = comp.pourcentage / 100; // poids relatif dans l'épreuve

    if (n === 0) rouge++;
    if (n === 1) orange++;
    if (n === 2) vertClair++;
    if (n === 3) vertFonce++;

    // Valeur sur 1 selon le niveau
    let valeur = 0;
    if (n === 1) valeur = 1 / 3;
    if (n === 2) valeur = 2 / 3;
    if (n === 3) valeur = 1;

    sommePonderee += valeur * poids;
  });

  // Note /20 pour cette épreuve (pondérée par les % internes)
  const note = Math.round(sommePonderee * 20 * 10) / 10;

  document.getElementById("rouge-"     + idEpreuve).innerText = rouge;
  document.getElementById("orange-"    + idEpreuve).innerText = orange;
  document.getElementById("vertClair-" + idEpreuve).innerText = vertClair;
  document.getElementById("vertFonce-" + idEpreuve).innerText = vertFonce;
  document.getElementById("note-"      + idEpreuve).innerText = note;
}

// Calcule la note finale globale (pondérée par coef épreuve)
function updateGlobal() {
  let sommeTotale = 0;
  let totalCoef = 0;

  for (const idEpreuve in epreuves) {
    const ep = epreuves[idEpreuve];
    const noteSpan = document.getElementById("note-" + idEpreuve);
    const noteEpreuve = noteSpan ? parseFloat(noteSpan.innerText) || 0 : 0;

    sommeTotale += noteEpreuve * ep.coefEpreuve;
    totalCoef += ep.coefEpreuve;
  }

  const noteFinale = totalCoef > 0 ? Math.round((sommeTotale / totalCoef) * 10) / 10 : 0;
  document.getElementById("note-finale").innerText = noteFinale;
}

// Remet tout à zéro
function resetAll() {
  for (const idEpreuve in epreuves) {
    epreuves[idEpreuve].competences.forEach(comp => { comp.niveau = 0; });
    renderEpreuve(idEpreuve);
  }
  updateGlobal();
}

// Lancement au chargement de la page
window.onload = init;
