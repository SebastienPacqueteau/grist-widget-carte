// ====================================
// ==== Configuration pour Grist ======
// ====================================

let colonnesNecessaires = [
	{
    name: 'region',
    title: "nom des régions",
    type: 'Any', // optional type of the column, // Int (Integer column), Numeric (Numeric column), Text, Date, DateTime, Bool (Toggle column), Choice, ChoiceList, Ref (Reference column), RefList (Reference List), Attachments.
		optional: false // if column is optional.
	},
  {name: 'information',title: "Information à afficher",type: 'Any',optional: false},
  {name: 'infoBulle',title: "Contenu de l'infoBulle",type: 'Any', optional: false},
  {name: 'couleurFondRegion',title: "Couleur du fond de la région",type: 'Any', optional: false}
];

let tableauRegion;
let colonnes;

function basculerOptionsWidget() {
		const sidebar = document.getElementById('optionsWidget');
		sidebar.classList.toggle('collapsed');
}

function MajDescriptionCarte() {
  grist.widgetApi.setOption('description', document.getElementById('majDescriptionCarte').value);
  document.getElementById('descriptionCarte').innerHTML = document.getElementById('majDescriptionCarte').value;
}

function MajTitreCarte() {
  grist.widgetApi.setOption('titre', document.getElementById('majTitreCarte').value);
  document.getElementById('titreCarte').innerHTML = document.getElementById('majTitreCarte').value;
}

function majInformation(context) {
  //console.log(context.id);
  document.getElementById('nomRegion').innerHTML = context.id;
  document.getElementById('contenuInformation').innerHTML = mmd(tableauRegion.find(obj => obj[colonnes.region] === context.id)[colonnes.information]);
  document.getElementById('autreInformation').innerHTML ="";
}

grist.ready({
	onEditOptions() {
		basculerOptionsWidget();
  },
  columns: colonnesNecessaires,
	requiredAccess: 'read table',
	allowSelectBy: false
});

async function initCarte (){
  tableauRegion = await grist.fetchSelectedTable({format: 'rows'});
	colonnes = await grist.sectionApi.mappings();

  let titreCarte = await grist.widgetApi.getOption('titre');
  let descriptionCarte = await grist.widgetApi.getOption('description');
  //mettre le contenu des options
  if (titreCarte){
    document.getElementById('titreCarte').innerHTML = titreCarte;
      document.getElementById('majTitreCarte').placeholder = titreCarte;
  }
  if (descriptionCarte){
    document.getElementById('descriptionCarte').innerHTML = descriptionCarte;
      document.getElementById('majDescriptionCarte').placeholder = descriptionCarte;
  }

  let carteFrance = new CarteFranceRegion("majInformation(this)");
  document.getElementById('carteFrance').appendChild(carteFrance.toSVG());
  CarteFranceRegion.activerInfoBulle();

  console.log(await grist.widgetApi.getOptions(), tableauRegion);
}

initCarte();
