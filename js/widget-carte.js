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
  {name: 'infoBulle',title: "Service",type: 'Any', optional: false},
  {name: 'couleurFondRegion',title: "Couleur du fond de la région",type: 'Any', optional: false}
];






function basculerOptionsWidget() {
		const sidebar = document.getElementById('optionsWidget');
		sidebar.classList.toggle('collapsed');
}

function MajDescriptionCarte() {
  grist.widgetApi.setOption('description', document.getElementById('descriptionCarte').value);
}

function MajTitreCarte() {
  grist.widgetApi.setOption('titre', document.getElementById('TitreCarte').value);
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
  const tableauRegion = await grist.fetchSelectedTable({format: 'rows'});
	const colonnes = await grist.sectionApi.mappings();

  let titreCarte = await grist.widgetApi.getOption('titre');
  let descriptionCarte = await grist.widgetApi.getOption('description');
  //mettre le contenu des options
  if (titreCarte){
    document.getElementById('TitreCarte').placeholder = titreCarte;
  }
  if (descriptionCarte){
    document.getElementById('TitreCarte').descriptionCarte = descriptionCarte;
  }

  let carteFrance = new CarteFranceRegion();
  document.getElementById('carteFrance').appendChild(carteFrance.toSVG());
  CarteFranceRegion.activerInfoBulle();
}

initCarte();
