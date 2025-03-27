function toggleOptions() {
    const logement = document.getElementById("logement");
    const house = document.getElementById("options-maison");
    const appartment = document.getElementById("options-appartement");
   
    if (logement.value === "maison") {
        house.style.display = "block";
        appartment.style.display = "none";
    } else if(logement.value === "appartement") {
        appartment.style.display = "block";
        house.style.display = "none";
    } else {
        house.style.display = "none";
        appartment.style.display = "none";
    }
};

function toggleDiet() {
    const dietSection = document.getElementById("dietSection");
    const breakfast = document.getElementById("breakfast").checked;   
    dietSection.style.display = breakfast ? "block" : "none";

};

document.getElementById("breakfast").addEventListener("change", toggleDiet);

function clearErrors() {
    const errorMessages = document.querySelectorAll(".error-message");
    errorMessages.forEach(error => error.innerText = "");
    window.errorCount = 0;
}

function validateField(value, condition, errorElement, errorMessage) {
    if (condition(value)) {
        errorElement.innerText = errorMessage;
        window.errorCount++;
    } else {
        errorElement.innerText = "";
    }
}

function prixTotal() {
    const oneDay = 24 * 60 * 60 * 1000;
    const arrivee = new Date(document.getElementById("arrivee").value);
    const depart = new Date(document.getElementById("depart").value);
    // Vérifier si les dates sont valides
    if (isNaN(arrivee.getTime()) || isNaN(depart.getTime())) {
        console.error("Les dates sont invalides");
        return 0; // Retourner 0 si les dates ne sont pas valides
    }

    const nights = Math.round((depart - arrivee) / oneDay);

    const tarifs = {
        maison: 500,
        appartement: 250,
        chauffeur: 11,
        guide: 25,
        breakfast: 25
    };

    let total = 0;
    const logementType = document.getElementById("logement").value;
    const chauffeur = document.getElementById("chauffeur").checked;
    const guide = document.getElementById("guide").checked;
    const breakfast = document.getElementById("breakfast").checked;
    const personnes = parseInt(document.getElementById("personnes").value.trim(), 10);

    total += (logementType === "maison" ? tarifs.maison : logementType === "appartement" ? tarifs.appartement : 0) * nights;
    total += chauffeur ? tarifs.chauffeur * nights : 0;
    total += guide ? tarifs.guide * nights : 0;
    total += breakfast ? tarifs.breakfast * nights * personnes : 0;
    return {total , nights};
}

document.getElementById("form").addEventListener("submit", function(event) {
    event.preventDefault(); 
    clearErrors(); 

    const fullName = document.getElementById("fullname").value.trim();
    let fullNameError = document.getElementById("error-fullname");
    const address = document.getElementById("address").value.trim();
    let addressError = document.getElementById("error-address");
    const email = document.getElementById("email").value.trim();
    let emailError = document.getElementById("error-email");
    const phone = document.getElementById("phone").value.replace(/\s+/g, '').trim();
    let phoneError = document.getElementById("error-phone");
    const logement = document.getElementById("logement").value;
    let optionsError = document.getElementById("error-logement");
    const jardin = document.getElementById("jardin");
    const piscine = document.getElementById("piscine");
    const balcon = document.getElementById("balcon");
    const ascenseur = document.getElementById("ascenseur");
    const personnes = parseInt(document.getElementById("personnes").value.trim(), 10);
    let personnesError = document.getElementById("error-personnes");
    const arrivee = new Date(document.getElementById("arrivee").value);
    const depart = new Date(document.getElementById("depart").value);
    let datesError = document.getElementById("error-dates");
    const petitDejeuner = document.getElementById("breakfast").checked;
    const regime = document.getElementById("regime").value;
    let regimeError = document.getElementById("error-regime");
    const guide =  document.getElementById("guide").checked;
    const chauffeur =  document.getElementById("chauffeur").checked;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(\?\d{1,3}[-.\s]?)?\d{9,12}$/; 

    validateField(fullName, val => val.length < 2 || val.length > 50, fullNameError, "Nom invalide (2-50 caractères)");
    validateField(address, val => val.length < 5 || val.length > 100, addressError, "Adresse invalide (5-100 caractères)");
    validateField(email, val => !emailRegex.test(val), emailError, "Email invalide");
    validateField(phone, val => !phoneRegex.test(val), phoneError, "Téléphone invalide (9-12 chiffres)");
    validateField(logement, val => (val === "maison" && !jardin.checked && !piscine.checked) || (val === "appartement" && !balcon.checked && !ascenseur.checked), optionsError, "Au moins une option requise");
    validateField(personnes, val => isNaN(val) || val < 1 || val > 10, personnesError, "Nombre de personnes invalide (1-10)");
    validateField([arrivee, depart], ([arrivee, depart]) => {
        return isNaN(new Date(arrivee).getTime()) || isNaN(new Date(depart).getTime()) || new Date(arrivee) >= new Date(depart);
    }, datesError, "Les deux dates doivent être remplies et la date de départ doit être après la date d'arrivée");
    
    validateField(petitDejeuner, val => val && !regime, regimeError, "Régime obligatoire si petit-déjeuner");

    const result = document.getElementById("result");

    if (window.errorCount > 0) {
        result.innerHTML = `<p>Il reste des erreurs</p>`;
        return; 
    } else {
        let { total, nights } = prixTotal();
        result.innerHTML = `
            <strong>Bonjour ${fullName}</strong><br>
            Adresse : ${address}<br>
            Adresse Email : ${email}<br>
            Numéro de téléphone : ${phone}<br>
            Type de logement : ${logement}<br>
            Option : ${
                logement === "maison" ? 
                `${jardin.checked ? "Jardin" : ""}${jardin.checked && piscine.checked ? " & " : ""}${piscine.checked ? "Piscine" : ""}` :
                logement === "appartement" ?
                `${balcon.checked ? "Balcon" : ""}${balcon.checked && ascenseur.checked ? " & " : ""}${ascenseur.checked ? "Ascenseur" : ""}` :
                "Aucune option"
            }<br>        
            Nombre de personnes : ${personnes}<br>
            Dates de séjour : ${arrivee.toLocaleDateString()} - ${depart.toLocaleDateString()}<br>
            Nombre de nuits :  ${nights}€<br>
            Petit-déjeuner : ${petitDejeuner ? "Oui" : "Non"}<br>
            Régime : ${regime ? regime : "Aucun"}<br>
            Guide : ${guide ? "Oui" : "Non"}<br>
            Chauffeur : ${chauffeur ? "Oui" : "Non"}<br>
            Total : ${total}€<br>
        `;
    }
});


document.getElementById("resetBtn").addEventListener("click", function() {
    document.getElementById("form").reset();
    clearErrors();
    document.getElementById("dietSection").style.display = "none";
    document.getElementById("options-maison").style.display = "none";
    document.getElementById("options-appartement").style.display = "none";
});


























