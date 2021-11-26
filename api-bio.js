AOS.init();
document.getElementById("cp").value="";
document.getElementById("nbR").value=200;
let select1=document.getElementById("ville");
newOption=document.createElement("option")
newOption.textContent="--Please choose an option--";
select1.append(newOption);
let LongLat;
let long;
let lat;
let reponse;
let urlBase="https://back.agencebio.org/api/gouv/operateurs/";
let url="https://back.agencebio.org/api/gouv/operateurs/" + "?q=annecy&nb=100";
afficherResultats(1);

// **********************************api pour trouver les communes avec le cp
function findDepartement() {
    let valeur=document.getElementById("cp").value;
    if (valeur > 9999 && valeur < 100000)
    {
        fetch("https://geo.api.gouv.fr/communes?codePostal=" + valeur, {
            method: "GET", //ou POST, PUT, DELETE, etc.
            headers: {
                "Content-Type": "text/plain;charset=UTF-8" //pour un corps de type chaine
            }
        })
            .then(response => response.json())
            .then(data => afficherResp(data))
            .catch(error => alert("Erreur : " + error));
    }
}
function afficherResp(reponse){
    let select=document.getElementById("ville");
    select.innerHTML="";
    let newOption;
    let chaine="";
    //alert((JSON.stringify(reponse)));
    newOption=document.createElement("option")
    newOption.textContent="--Please choose an option--";
    select.append(newOption);
    for (let i=0;i<Object.keys(reponse).length;i++){
        chaine=reponse[i].nom;
        newOption=document.createElement("option");
        newOption.setAttribute("name","villes"+toString(i));
        newOption.textContent=chaine;
        select.append(newOption);

    }

}
//*******************************************************************
// api pour trouver les rues avec
function findRue() {
    let valeur=document.getElementById("ville").value;
    if (valeur!=null || valeur!=="" || valeur!=="--Please choose an option--")
    {
        fetch("https://api-adresse.data.gouv.fr/search/?q="+valeur+"&type=street&limit=150 ", {
            method: "GET", //ou POST, PUT, DELETE, etc.
            headers: {
                "Content-Type": "text/plain;charset=UTF-8" //pour un corps de type chaine
            }
        })
            .then(response => response.json())
            .then(data => afficherRue(data))
            .catch(error => alert("Erreur : " + error));
    }
}
function afficherRue(reponse) {
    let select = document.getElementById("rues");
    select.innerHTML = "";
    let newOption;
    let chaine = "";
    let longueur=Object.keys(reponse.features).length;
    newOption = document.createElement("option")
    newOption.textContent = "--Please choose an option--";
    select.append(newOption);
    //************************************************recherche1 qui match (en tete de liste)**************************
    for (let i = 0; i < longueur;i++) {
        let voie=strNoAccent(document.getElementById("voieType").value)+" "+(document.getElementById("voieNom").value).toLowerCase();
        let usingVoie= voie.split(' ');
        chaine = strNoAccent(reponse.features[i].properties.name).toLowerCase();
        //boucle ou les elements matchent à 100% avec les voies trouvées (en tete de la liste deroulante)
        for (let j = 0; j < usingVoie.length; j++) {
            let match=0;
            for (let w = 0; w < usingVoie.length; w++) {
                if ((chaine.toLowerCase()).includes((usingVoie[w]).toLowerCase())) {
                    match++;
                }
            }
            if ((chaine.toLowerCase()).includes((usingVoie[j]).toLowerCase()) && match>=usingVoie.length) {
                newOption = document.createElement("option");
                newOption.setAttribute("name", "rues" + toString(i));
                newOption.textContent = chaine;
                select.append(newOption);
                j=usingVoie.length;
                break;
            }
        }//****************************************fin boucle
    }
    //***********************************RECHERCHE 2 qui match moins****************************************
    for (let i = 0; i < longueur;i++) {
        let voie=strNoAccent(document.getElementById("voieType").value)+" "+(document.getElementById("voieNom").value).toLowerCase();
        let usingVoie= voie.split(' ');
        chaine = strNoAccent(reponse.features[i].properties.name).toLowerCase();
        // boucle ou les elements matchent pas a 100% avec les voies trouvées
        for (let j = 0; j < usingVoie.length; j++) {
            let match=0;
            for (let w = 0; w < usingVoie.length; w++) {
                if ((chaine.toLowerCase()).includes((usingVoie[w]).toLowerCase())) {
                    match++;
                }
            }


            if ((chaine.toLowerCase()).includes((usingVoie[j]).toLowerCase()) && match>=usingVoie.length-1) {
                newOption = document.createElement("option");
                newOption.setAttribute("name", "rues" + toString(i));
                newOption.textContent = chaine;
                select.append(newOption);
                j=usingVoie.length;
                break;
            }
        }
        //********************
    }
    //*********************************************************************************************
}
//*********************************FUNCTION AFFICHE LATTITUDE /LONGITUDE***************************
function afficherLatLong() {
    let num=document.getElementById("nRue").value;
    let adresse= document.getElementById("rues").value;
    let reg = /[ ]/g;
    adresse=adresse.replace(reg,"+");
    let cp= document.getElementById("cp").value;
    fetch("https://api-adresse.data.gouv.fr/search/?q="+num+"+"+adresse+"&postcode="+cp, {
        method: "GET", //ou POST, PUT, DELETE, etc.
        headers: {
            "Content-Type": "text/plain;charset=UTF-8" //pour un corps de type chaine
        }
    })
        .then(response => response.json())
        .then(data => affichageLocalisation(data))
        .catch(error => alert("Erreur : " + error));

}
//*************************************************************************************************
function affichageLocalisation(reponse) {
    if (Object.keys(reponse.features[0].geometry).length > 0) {
        long = reponse.features[0].geometry.coordinates[0];
        lat = reponse.features[0].geometry.coordinates[1];
        document.getElementById("latLong").innerText = "longitude/Latitude: " + long+"/"+lat;
    }
}
//***function no accent****************************************************************************
function strNoAccent(a) {
    let b="áàâäãåçéèêëíïîìñóòôöõúùûüýÁÀÂÄÃÅÇÉÈÊËÍÏÎÌÑÓÒÔÖÕÚÙÛÜÝ",
        c="aaaaaaceeeeiiiinooooouuuuyAAAAAACEEEEIIIINOOOOOUUUUY",
        d="";
    for(let i = 0, j = a.length; i < j; i++) {
        let e = a.substr(i, 1);
        d += (b.indexOf(e) !== -1) ? c.substr(b.indexOf(e), 1) : e;
    }
    return d;
}//************************************************************************************************

//*********afficher resultats*********************************************************************
function afficherResultats(x) {
    document.getElementById("recherches").innerHTML='<img style="width: 96px; height: 96px;" src="https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif" alt="gif"/>';
    if (x===0 || x==null) {x=1;}
    fetch(url, {
        method: "GET", //ou POST, PUT, DELETE, etc.
        headers: {
            "Content-Type": "text/plain;charset=UTF-8" //pour un corps de type chaine
        }
    })
        .then(response => response.json())
        .then(data => pageChoisie(data,x))
        .catch(error => alert("Echec lors de la récupération des résultats..."));
}
function pageChoisie(resp,x) {
    if (resp==null){} else {reponse=resp;}
    let select1 = document.getElementById("resultats");
    select1.innerHTML = '';
    document.getElementById("recherches").innerText="Rechercher-nombre de résultat(s): "+Object.keys(reponse.items).length;
    let nbItem=Object.keys(reponse.items).length;
    if (nbItem!==0 || nbItem!=null) {
        let nbPage = Math.trunc((new Number(nbItem)) / 20) + 2;
        document.getElementById("nbPage").innerHTML = ""
        let chaine = "";
        for (i = 1; i <nbPage; i++) {
            let p1 = i * 20 - 19;
            let p2 = i * 20;
            if (p1<=nbItem) {
                chaine = chaine + "<button id='page" + parseInt(i) + "' class='btn btn-success m-3 justify-content-around' onclick='pageChoisie(null," + p1 + ")'>page N°" + parseInt(i) + "(" + p1 + "-" + p2 + ")</button>";
            }
        }
        document.getElementById("nbPage").innerHTML = chaine;
    }
    let select=document.getElementById("resultats");
    let item=reponse.items;
    longeur=nbItem;
    let p1=x;
    let p2=x+19;
    for (let i=p1-1;i<p2;i++) {
        if (i<longeur) {
            let div = document.createElement('div', {is: "div"+parseInt(i)});
            div.setAttribute("class","col-lg-12 justify-content-center text-center bg-vertkaki mt-4")
            div.setAttribute("style","border-radius: 5px; border-style: solid; border-width: 5px; border-color: #5cb85c; color: orange;");
            select.append(div);
            if (item[i].raisonSociale!=null) {
                let h1 = document.createElement('h2');
                h1.style = "background-color: green; color: beige; border-radius: 5px; border-style: solid; border-width: 3px; border-color: #4d944d; margin-top: 5px;";
                h1.class = "text-start mt-2 bg-success";
                h1.textContent = "Raison sociale: " + item[i].raisonSociale;
                div.append(h1);
            }
            if (item[i].siret!=null) {
                let h3 = document.createElement('h3');
                h3.style = "color: pink; ";
                h3.class = "ml-2 text-start mt-2";
                h3.textContent = "numero de siret: " + item[i].siret;
                div.append(h3);
            }
            if (item[i].numeroBio!=null) {
                let p = document.createElement('p');
                p.style = "color: grey; ";
                p.class = "ml-2 text-start mt-2";
                p.textContent = " numero Bio: " + item[i].numeroBio
                div.append(p);
            }
            let tell=item[i].telephone;
            if (tell==null) {tell="non renseigné";}
            let p1 = document.createElement('p');
            p1.style = "color: grey; ";
            p1.class = "ml-2 text-start mt-2";
            p1.textContent = " tel: " + tell;
            div.append(p1);
            let cde=item[i].codeNAF;
            if (cde==null) {cde="non renseigné";}
            let gerent=item[i].gerant;
            if (gerent==null) {gerent="non renseigné"}
            let p2 = document.createElement('p');
            p2.style = "color: yellow; ";
            p2.class = "ml-2 text-start mt-2";
            p2.textContent = " code NAF: " + cde + " gérant: " + gerent;
            div.append(p2);
            let dtmise;
            if (item[i].dateMaj==null) {dtmise="non renseigné";} else {
                dtmise=formaterDate(item[i].dateMaj);
               }
            let p3 = document.createElement('p');
            p3.style = "color: orange; ";
            p3.class = "ml-2 text-end mt-2";
            p3.textContent = " Date mise à jour: " + dtmise;
            div.append(p3);
            let reso;
            if (item[i].reseau==null || item[i].reseau==="" || item[i].reseau===undefined) {reso="non renseigné";} else {reso=item[i].reseau;}
            let p4 = document.createElement('p');
            p4.style = "color: aliceblue; ";
            p4.class = "ml-2 text-end mt-2";
            p4.textContent = " Réseau: " + reso;
            div.append(p4);
            let telph;
            if (item[i].telephoneCommerciale==null) {telph="non renseigné";} else {telph=item[i].telephoneCommerciale;}
            let p5 = document.createElement('p');
            p5.style = "color: orange; ";
            p5.class = "ml-2 text-end mt-2";
            p5.textContent = " tel commercial: " + telph;
            div.append(p5);
            if (Object.keys(item[i].adressesOperateurs).length>0) {
                for (let adre = 0; adre < Object.keys(item[i].adressesOperateurs).length; adre++) {
                    let p6 = document.createElement('p');
                    p6.style = "color: orange; ";
                    p6.class = "ml-2 text-end mt-2";
                    p6.textContent = "adresse: " + item[i].adressesOperateurs[adre].lieu + "-" + item[i].adressesOperateurs[adre].codePostal + "-" + item[i].adressesOperateurs[adre].ville;
                    div.append(p6);
                    let p7 = document.createElement('p');
                    p7.style = "color: orange; ";
                    p7.class = "ml-2 text-end mt-2";
                    p7.textContent = "adresse suite: lat/long " + item[i].adressesOperateurs[adre].lat + "-" + item[i].adressesOperateurs[adre].long + "-" + item[i].adressesOperateurs[adre].departementId;
                    div.append(p7);
                    let p8 = document.createElement('p');
                    p8.style = "color: green; ";
                    p8.class = "ml-2 text-end mt-2";
                    p8.textContent = "--------------------------------";
                    div.append(p8);
                }
            }
            //******************************************
            if (Object.keys(item[i].activites).length>0) {
                let p11 = document.createElement('p');
                p11.style = "color: yellow; ";
                p11.class = "ml-2 text-end mt-2";
                p11.textContent = "activité(s): ";
                div.append(p11);
                for (let adre = 0; adre < Object.keys(item[i].activites).length; adre++) {
                    let p12 = document.createElement('p');
                    p12.style = "color: yellow; ";
                    p12.class = "ml-2 text-end mt-2";
                    p12.textContent = item[i].activites[adre].nom + "-" + item[i].activites[adre].id + "-";
                    div.append(p12);
                }
            }
            //******************************************
            if (Object.keys(item[i].productions).length>0) {
                let p9 = document.createElement('p');
                p9.style = "color: aliceblue; ";
                p9.class = "ml-2 text-end mt-2";
                p9.textContent = "production(s) certifiée(s) bio: ";
                div.append(p9);
                for (let adre = 0; adre < Object.keys(item[i].productions).length; adre++) {
                    let p10 = document.createElement('p');
                    p10.style = "color: aliceblue; ";
                    p10.class = "ml-2 text-end mt-2";
                    p10.textContent = item[i].productions[adre].nom + "-" + item[i].productions[adre].code + "-";
                    div.append(p10);
                }
            }
            //******************************************
            let p13 = document.createElement('p');
            p13.style = "color: pink; ";
            p13.class = "ml-2 text-end mt-2";
            p13.textContent = "certificats: cliquer ci-dessous pour accéder au certificat";
            div.append(p13);
            for(let adre=0;adre<Object.keys(item[i].certificats).length;adre++) {
                let p14 = document.createElement('a');
                p14.style = "color: pink; ";
                p14.class = "ml-2 text-end mt-2";
                if (item[i].certificats[adre].url!=null) {
                    p14.href = item[i].certificats[adre].url
                    p14.target = "_blank"
                }
                let orga=item[i].certificats[adre].organisme;
                if (orga==null) {orga="non renseigné";}
                let etat=item[i].certificats[adre].etatCertification;
                if (etat==null) {etat="non renseigné";}
                let dtEng=item[i].certificats[adre].dateEngagement;
                if (dtEng==null) {dtEng="non renseigné";} else {dtEng=formaterDate(dtEng);}
                let dtNotif=item[i].certificats[adre].dateNotification;
                if (dtNotif==null) {dtNotif="non renseigné";} else {dtNotif=formaterDate(dtNotif);}
                let dtSus=item[i].certificats[adre].dateSuspension;
                if (dtSus==null) {dtSus="pas de suspension";} else {dtSus=formaterDate(dtSus);}
                let webSit=item[i].certificats[adre].url;
                if (webSit==null) {webSit="non renseigné";}
                let dtArret=item[i].certificats[adre].dateArret;
                if (dtArret==null) {dtArret="aucune renseignée";} else {dtArret=formaterDate(dtArret);}
                p14.textContent = "organisme de certification: "+ orga + "-------état certificats: "
                    + etat + "- date suspension: "+ dtSus+ "- date d'arrêt :"+ dtArret;
                div.append(p14);
                let p15 = document.createElement('p');
                p15.style = "color: pink; ";
                p15.class = "ml-2 text-end mt-2";
                p15.textContent =  "-date engagement: "+dtEng+"-------date notif: "+dtNotif+"--adresse web: "+webSit;
                div.append(p15);
            }
            //******************************************
            if (Object.keys(item[i].siteWebs).length>0) {
                let p15 = document.createElement('p');
                p15.style = "color: yellow; ";
                p15.class = "ml-2 text-end mt-2";
                p15.textContent = "site web(s): ";
                div.append(p15);
                if (Object.keys(item[i].siteWebs) == null || Object.keys(item[i].siteWebs) === []) {
                    for (let adre = 0; adre < Object.keys(item[i].siteWebs).length; adre++) {
                        alert(Object.keys(item[i].siteWebs).length);
                        let p16 = document.createElement('p');
                        p16.style = "color: yellow; ";
                        p16.class = "ml-2 text-end mt-2";
                        p16.textContent = "adresse web:" + item[i].siteWebs[adre].url + "-------type :" + item[i].siteWebs[adre].typeSiteWeb;
                        div.append(p16);
                    }
                }
            }
            //******************************************
            }
    }
}
function RecupDonneesFormulaireApi() {
    let start = "?"
    let recherche = "q=" + document.getElementById("recherche").value;
    let activity = "activite=" + document.getElementById("activité").value;
    let production = "produit=" + document.getElementById("production").value;
    let nomR = "nom=" + document.getElementById("nomRaisonSociale").value;
    let numBio = "numeroBio=" + document.getElementById("numéroBio").value;
    let departs = "departements=" + document.getElementById("departements").value;
    let latit = lat;
    let longi = long;
    let triePar = "trierPar=" + document.getElementById("triePar").value;
    let ordreTri = "ordreTri=" + document.getElementById("triAsc").value;
    let filtreVenteDetail = document.getElementById("venteDetail").value;
    let filtrerCommercantsEtArtisans = document.getElementById("filtrerCommercantsEtArtisans").value;
    let filtreResto = document.getElementById("filtrerRestaurants").value;
    let filtrerGrandeSurface = document.getElementById("filtrerGrandeSurface").value;
    let filtrerGrossiste = document.getElementById("filtrerGrossistes").value;
    let filtrerMagspe = document.getElementById("filtrerMagasinSpe").value;
    let nbResult="nb="+document.getElementById("nbR").value;
    let requeter = urlBase + start;
    let first = 0;
    if (recherche !=="q=" && recherche!==undefined && recherche!=null) {
        if (first === 0) {
            first = 1;
            requeter = requeter + recherche;
        }
    }
    //**********************************
    if (activity !=="activite=" && activity!==undefined && activity!=null ) {
        if (first === 1) {
            requeter = requeter + "&" + activity;
        } else if (first === 0) {
            requeter = requeter + activity;
            first = 1;
        }
    }
    //**********************************
    if (production !=="produit=" && production!==undefined && production!=null) {
        if (first === 1) {
            requeter = requeter + "&" + production;
        } else if (first === 0) {
            requeter = requeter + production;
            first = 1;
        }
    }
    //*********************************
    if (nomR!== "nom=" && nomR!==undefined && nomR!=null) {

        if (first === 1) {
            requeter = requeter + "&" + nomR;
        } else if (first === 0) {
            requeter = requeter + nomR;
            first = 1;
        }
    }
    //*********************************
    if (numBio!== "numeroBio=" && numBio!==undefined && numBio!=null) {
        if (first === 1) {
        requeter = requeter + "&" + numBio;
        } else if (first === 0) {
        requeter = requeter + numBio;
        first = 1;
        }
    }
    //*********************************
    if (departs!=="" && departs!==undefined && departs!=null) {
        if (first === 1) {
            requeter = requeter + "&" + departs;
        } else if (first === 0) {
            requeter = requeter + departs;
            first = 1;
        }
    }
    //*********************************
   //********long lat
    if (latit!=="" && longi!=="" && latit!==undefined && longi!==undefined) {
        if (first === 1) {
            requeter = requeter + "&" + "lat=" + latit + "&lng=" + longi;
        } else if (first === 0) {
            requeter = requeter + "lat=" + latit + "&lng=" + longi;
            first = 1;
        }
    }
    //*********************************
    if (triePar!=="trierPar=" && triePar!==undefined && triePar!=null) {
        if (first === 1) {
            requeter = requeter + "&" + triePar;
        } else if (first === 0) {
            requeter = requeter + triePar;
            first = 1;
        }
    }
    //*********************************
    if (ordreTri !== "ordreTri=" && ordreTri != null) {
        if (first === 1) {
            requeter = requeter + "&" + ordreTri;
        } else if (first === 0) {
            requeter = requeter + ordreTri;
            first = 1;
        }
    }
    //*********************************
    if (filtreVenteDetail==="filtrerVenteDetail=1") {
        if (first === 1) {
            requeter = requeter + "&" + filtreVenteDetail;
        } else if (first === 0) {
            requeter = requeter + filtreVenteDetail;
            first = 1;
        }
    }
    //*********************************
    if (filtrerCommercantsEtArtisans==="filtrerCommercantsEtArtisans=1") {
        if (first === 1) {
            requeter = requeter + "&" + filtrerCommercantsEtArtisans;
        } else if (first === 0) {
            requeter = requeter + filtrerCommercantsEtArtisans;
            first = 1;
        }
    }
    //*********************************
    if (filtreResto==="filtrerRestaurants=1") {
        if (first === 1) {
            requeter = requeter + "&" + filtreResto;
        } else if (first === 0) {
            requeter = requeter + filtreResto;
            first = 1;
        }
    }
    //*********************************
    if (filtrerGrandeSurface==="filtrerGrandeSurface=1") {

        if (first === 1) {
            requeter = requeter + "&" + filtrerGrandeSurface;
        } else if (first === 0) {
            requeter = requeter + filtrerGrandeSurface;
            first = 1;
        }
    }
    //*********************************
    if (filtrerGrossiste==="filtrerGrossistes=1") {

        if (first === 1) {
            requeter = requeter + "&" + filtrerGrossiste;
        } else if (first === 0) {
            requeter = requeter + filtrerGrossiste;
            first = 1;
        }
    }
    //*********************************
    if (filtrerMagspe==="filtrerMagasinSpec=1") {

        if (first === 1) {
            requeter = requeter + "&" + filtrerMagspe;
        } else if (first === 0) {
            requeter = requeter + filtrerMagspe;
            first = 1;
        }
    }
    if (nbResult==="nb=") {
        nbResult="nb=200";
        document.getElementById("nbR").value=200;
    }
    if (first===1) {
        requeter = requeter + "&"+nbResult;
    } else if (first===0) {
        requeter = requeter + nbResult;
    }
    //*********************************
    url=requeter;
    afficherResultats(1);
}

function deleteLocalisation() {
lat=undefined;
long=undefined;
    document.getElementById("latLong").innerText = "";
    document.getElementById("cp").value="";
    document.getElementById("ville").value="--Please choose an option--";
    document.getElementById("rues").value="";
    document.getElementById("nRue").value="";
    document.getElementById("voieNom").value="";
    document.getElementById("voieType").value="";
    findDepartement();
}

function formaterDate(dateFormat) {
    let event = new Date(dateFormat)
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
     return event.toLocaleDateString('fr-FR');
}