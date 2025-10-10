// ========================================================
// ====== Objet pour définir les contours des cartes ======
// ========================================================

class CarteFranceDept{
  #objectFit = "contain";
  #viewBox = "0 0 675 570";
  #svg;
  constructor(fonctionSurClique = null) {
    this.listeDepartement = [];
  	let departementTmp;
  	CarteFranceDept.jsonDepartements().forEach((departement, i)=>{
      departementTmp = new Departement(departement);
  		if (fonctionSurClique){
  			departementTmp.ajouterFonctionClique(fonctionSurClique)
  		}
  		this.listeDepartements.push(departementTmp);
  	});
  }

	toSVG(){
		if (!this.#svg){
			this.#svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
			this.#svg.style.objectFit = this.#objectFit;
			this.#svg.setAttribute("viewBox", this.#viewBox);

			this.listeDepartements.forEach((departement,i) => {
				departement.modifierLegende(departement.nom);
				departement.toSVG().forEach((balise, j)=>{
					this.#svg.appendChild(balise);
				});
			});
		}
		return this.#svg;
	}

  recupererDepartement(nomDepartement){
		return this.listeDepartements.find(i => i.nom === nomDepartement);
	}

	modifierLegendeDepartement(nomDepartement, nouvelleLegende){
		this.recupererDepartement(nomDepartement).modifierLegende(nouvelleLegende);
	}

	modifierCouleurFondDepartement(nomDepartement, nouvelleCouleur){
		this.recupererDepartement(nomDepartement).modifierCouleurFond(nouvelleCouleur);
	}

	ajouterFonctionClique(nomDepartement, nomFonction){
		this.recupererDepartement(nomDepartement).ajouterFonctionClique(nomFonction);
	}

	ajouterBaliseTexte(nomDepartement, textAAfficher){
		this.#svg.appendChild(this.recupererDepartement(nomDepartement).ajouterBaliseTexte(textAAfficher));
	}

	static activerInfoBulle(){
		var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
		var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
			return new bootstrap.Tooltip(tooltipTriggerEl)
		})
	}

	static jsonDepartements(){
    const urlJsonDepartements = "https://sebastienpacqueteau.github.io/grist-widget-carte/cartes/departements.json";
		let xhttp = new XMLHttpRequest();
		let departements;
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
			   // Typical action to be performed when the document is ready:
			   departements = JSON.parse(xhttp.response);
			   //console.log(departements);
			}
		};
		xhttp.open("GET", urlJsonDepartements, false);
		xhttp.send();
		return departements;
	}
}


  class Departement{
  	#couleurFond = "#FFFFFF";
  	#fillRule = "evenodd";
  	#clipRule = "evenodd";
  	#couleurBordure = "#000000";
  	#tailleBordure = 1;
  	#legende = "";
  	constructor(jsonCollectivites) {
  		this.nom = jsonCollectivites.nom;
      this.numero = jsonCollectivites.code_INSEE;
      this.region = jsonCollectivites.region;
  		this.path = jsonCollectivites.path;
  		this.text_x = jsonCollectivites.text_x;
  		this.text_y = jsonCollectivites.text_y;
  		this.fonctionSurClique = "";
  	}

  	modifierLegende(legendeHTML){
  		this.#legende = legendeHTML;
  	}

  	modifierCouleurFond(couleur){
  		this.#couleurFond = couleur;
  	}

  	ajouterFonctionClique(nomFonction){
  		this.fonctionSurClique = nomFonction;
  	}

  	toSVG() {
  		let balises = [];
  		let baliseTmp;
  		this.path.forEach((d, i) => {
  			baliseTmp= document.createElementNS("http://www.w3.org/2000/svg",'path');
  			baliseTmp.setAttribute("id", this.numero);
  			baliseTmp.setAttribute("fill-rule", this.#fillRule);
  			baliseTmp.setAttribute("clip-rule", this.#clipRule);
  			baliseTmp.setAttribute("fill", this.#couleurFond);
  			baliseTmp.setAttribute("stroke", this.#couleurBordure);
  			baliseTmp.setAttribute("stroke-opacity", this.#tailleBordure);
  			baliseTmp.setAttribute("d", d);
  			if (this.#legende){
  				baliseTmp.setAttribute("data-bs-toggle", "tooltip");
  				baliseTmp.setAttribute("data-bs-placement", "right");
  				baliseTmp.setAttribute("data-bs-html", "true");
          baliseTmp.setAttribute("data-region", "true");
  				baliseTmp.setAttribute("title", this.#legende);
  			}
  			if (this.fonctionSurClique){baliseTmp.setAttribute("onclick", this.fonctionSurClique);}

  			balises.push(baliseTmp);
  		});

  		return balises;
  	}

  	ajouterBaliseTexte(textAAfficher){
  		let balise = document.createElementNS("http://www.w3.org/2000/svg",'text');
  		balise.setAttribute("x", this.text_x);
  		balise.setAttribute("y", this.text_y);
  		balise.setAttribute("text-anchor", "middle");
  		balise.setAttribute("alignment-baseline", "middle");
  		balise.setAttribute("font-family", "Marianne");
  		balise.innerHTML = textAAfficher;
  		return balise;
  	}
  }
