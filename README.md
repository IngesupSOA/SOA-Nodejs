# SOA-Nodejs
site global:
	systeme de connexion
		check si user ynov(via mail + confirmation)
		utilisation de mot de passe

	page interne sécurisée
		redirection accueil si non loggé
		affichage de l'utilisateur courrant
		profil de l'utilisateur
			nom / prenom / pseudo / email (inchangé) / promotion / campus / avatar / adress (facultatif) / téléphone (facultatif) 
			lien fb ....

		trombinoscope
			afficher toutes les images de tous les etudiants d'une catégorie
			afficher le nom sous les images

		chat 
			nom d'utilisateur
			service de chan différents (socket io)
			afficher des images
			SECURISE !!

		Ajouter une idée
		
Liste des tâches :

	Massil + Steph :
		- Page de connexion standard + lien d'inscription
		
	Antoine + Thomas :
		- Gestion des droits (Token)
		
	Leon + Bart :
		- Validation du paiement
			- Infos paimement
			- Etat commande
			- Relance paiement / via mail) (V2 = sms)
	
	Nans + Tristan :
		- Pizzanoscope
			- Validation sur son compte
			
	V2 pour le BDE