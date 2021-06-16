Projet Lettres, lundi 17 mai 2021 : indexation/recherche
===

## Définition du besoin

### Exemples

- simple : [http://emlo.bodleian.ox.ac.uk/home](http://emlo.bodleian.ox.ac.uk/home)
- search+ : [http://emlo.bodleian.ox.ac.uk/advanced](http://emlo.bodleian.ox.ac.uk/advanced)


### Options de recherche

- **Pouvoir lister des lettres selon leurs seules métadonnées (pas de motif de recherche)**
- Pour l’indexation plein texte :
	- expressions régulières (troncatures, etc.)
	- casse (déjouer)
	- diacritiques (déjouer)
	- TODO : lister les options utiles.
	- recherche floue ; possibilité d’ancrer la recherche floue, par ex. `^roi`
	- TODO : voir les cas de redoublement de consonnes, `i|j`
	- toutes les langues dans le même index

### Contexte des recherche

Analyse OU Transcription [ET à évaluer ?] :

- analyse de la lettre : page de résultats = liste du groupe (titre, analyse)
- transcription, cf ci-dessous

### Concordance

cf collocation, vue KWIC pour le résultat, groupé par lettre.

### Collocations

OP souhaite pouvoir faire des recherches de termes selon le contexte :

> Dans quelles circonstances on va systématiquement associer le personnage "Coligny" et les termes "trahison" et/ou "gouvernement" ?

Information contextuelle :

- par défaut, on a la lettre comme contexte.
- souhait de pouvoir régler la fenêtre de recherche : lettres > 100 mots > 10 mots > 5 mots
- TODO : voir si de telles collocations sont implémentables avec ElasticSearch
- voir : [https://opensourceconnections.com/blog/2019/05/16/unreasonable-effectiveness-of-collocations/](https://opensourceconnections.com/blog/2019/05/16/unreasonable-effectiveness-of-collocations/)

Résultat :

- par lettre
- pouvoir visualiser par lettre les occurrences du motif recherché


### Filtres et tris

- correspondant : expéditeur / destinataire :
	- 2 champs, autocomplétion
- date de temps (slider + saisie) :
	- attention interface, pouvoir descendre au jour -> voir les filtres EMLO.
	- proposition OP : un slider selon la granularité : AAAA / MM / JJ ?
	- [https://vuejsexamples.com/tag/calendar/](https://vuejsexamples.com/tag/calendar/) ?
- date de lieu, par défaut **expédition**
	- proposer de l’autocomplétion sur le lieu candidat
	- top pour OP : pouvoir filtrer en traçant une zone sur une carte
- collection / sous-collections : attention, une lettre peut être présente dans plusieurs collections.
- langue

### Exemples

- Sortir toutes les lettres en italien de Catherine de Médicis
- Sortir toutes les lettres en italien de Catherine de Médicis en 1580

