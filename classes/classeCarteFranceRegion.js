// ========================================================
// ====== Objet pour définir les contours des cartes ======
// ========================================================

class CarteFranceRegion{

	#objectFit = "contain";
	#viewBox = "0 0 675 570";
	#svg;
	constructor(fonctionSurClique = null) {
		this.listeRegions = [];
		let regionTmp;
		CarteFranceRegion.jsonRegions().forEach((region, i)=>{
			regionTmp = new Region(region);
			if (fonctionSurClique){
				regionTmp.ajouterFonctionClique(fonctionSurClique)
			}
			this.listeRegions.push(regionTmp);
		});
	}


	toSVG(){
		if (!this.#svg){
			this.#svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
			this.#svg.style.objectFit = this.#objectFit;
			this.#svg.setAttribute("viewBox", this.#viewBox);

			this.listeRegions.forEach((region,i) => {
				region.modifierLegende(region.nom);
				region.toSVG().forEach((balise, j)=>{
					this.#svg.appendChild(balise);
				});
			});
		}
		return this.#svg;
	}



	recupererRegion(nomRegion){
		return this.listeRegions.find(i => i.nom === nomRegion);
	}

	modifierLegendeRegion(nomRegion, nouvelleLegende){
		this.recupererRegion(nomRegion).modifierLegende(nouvelleLegende);
	}

	modifierCouleurFondRegion(nomRegion, nouvelleCouleur){
		this.recupererRegion(nomRegion).modifierCouleurFond(nouvelleCouleur);
	}

	ajouterFonctionClique(nomRegion, nomFonction){
		this.recupererRegion(nomRegion).ajouterFonctionClique(nomFonction);
	}	
	
	ajouterBaliseTexte(nomRegion, textAAfficher){
		this.#svg.appendChild(this.recupererRegion(nomRegion).ajouterBaliseTexte(textAAfficher));
	}

	static activerInfoBulle(){
		var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
		var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
			return new bootstrap.Tooltip(tooltipTriggerEl)
		})
	}

	static jsonRegions(){
		const urlJsonRegions = "https://sebastienpacqueteau.github.io/grist-widget-carte/cartes/regions.json";
		let xhttp = new XMLHttpRequest();
		let regions;
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
			   // Typical action to be performed when the document is ready:
			   regions = JSON.parse(xhttp.response);
			   //console.log(regions);
			}
		};
		xhttp.open("GET", urlJsonRegions, false);
		xhttp.send();
		return regions;
	}
}


class Region{
	#couleurFond = "#FFFFFF";
	#fillRule = "evenodd";
	#clipRule = "evenodd";
	#couleurBordure = "#000000";
	#tailleBordure = 1;
	#legende = "";
	constructor(jsonCollectivites) {
		this.nom = jsonCollectivites.nom;
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
			baliseTmp.setAttribute("id", this.nom);
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
				baliseTmp.setAttribute("title", this.#legende);
			}
			if (this.fonctionSurClique){baliseTmp.setAttribute("onclick", this.fonctionSurClique);}

			balises.push(baliseTmp);
		});

		return balises;
	}

	ajouterBaliseTexte(textAAfficher){
		let balise = document.createElementNS("http://www.w3.org/2000/svg",'text');
		balise.setAttribute("x", this.#fillRule);
		balise.setAttribute("y", this.#clipRule);
		balise.setAttribute("text-anchor", "middle");
		balise.setAttribute("alignment-baseline", "middle");
		balise.setAttribute("font-family", "Marianne");
		balise.innerHTML = textAAfficher;
		return balise;
	}
}
