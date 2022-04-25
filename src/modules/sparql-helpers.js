
class SPARQLQueryDispatcher {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  query(sparqlQuery) {
    const fullUrl = this.endpoint + "?query=" + encodeURIComponent(sparqlQuery);
    const headers = { Accept: "application/sparql-results+json" };

    return fetch(fullUrl, { headers }).then((body) => body.json());
  }
}

const endpointUrl = "https://query.wikidata.org/sparql";

const getPlacenameQuery = name => `SELECT DISTINCT ?item ?label ?paysLabel ?coords ?itemDescription
WHERE
{
  SERVICE wikibase:mwapi
  {
    bd:serviceParam wikibase:endpoint "www.wikidata.org";
                    wikibase:api "Generator";
                    mwapi:generator "search";
                    mwapi:gsrsearch "inlabel:${name}";
                    mwapi:gsrlimit "max".
    ?item wikibase:apiOutputItem mwapi:title.
  }
  ?item rdfs:label ?label.
  ?item wdt:P17 ?pays.
  ?item wdt:P625 ?coords.
  ?item p:P31 ?statement0.
  ?statement0 (ps:P31/(wdt:P279*)) wd:Q486972.
  ?pays wdt:P30 wd:Q46;

  FILTER(LANG(?label) = "fr")
  service wikibase:label {bd:serviceParam wikibase:language  "fr","en".}
}
ORDER BY ?label ?pays 
LIMIT 35`;
//  FILTER CONTAINS(?label, "${name}")


const getPersonQuery = name => `SELECT DISTINCT ?human ?humanLabel ?lastnameLabel ?nationalityLabel ?humanDescription ?humanAltLabel
WHERE
{
  SERVICE wikibase:mwapi
  {
    bd:serviceParam wikibase:endpoint "www.wikidata.org";
                    wikibase:api "Generator";
                    mwapi:generator "search";
                    mwapi:gsrsearch "inlabel:${name}";
                    mwapi:gsrlimit "max".
    ?human wikibase:apiOutputItem mwapi:title.
  }
 ?human wdt:P31 wd:Q5 .
    optional { ?human wdt:P734 ?lastname . }
    optional { ?human wdt:P569 ?birthdate . }
    optional { ?human wdt:P570 ?deathdate . }
    optional { ?human wdt:P27 ?nationality . }
  
      SERVICE wikibase:label {
        bd:serviceParam wikibase:language "fr", "en", "it", "es" .
    }

}
ORDER BY ?humanLabel 
LIMIT 25`;

const queryDispatcher = new SPARQLQueryDispatcher(endpointUrl);

export function runWikidataSparqlQuery (query) {
  return queryDispatcher.query(query)
}

export function searchWikidataPlacename (name) {
  return queryDispatcher.query(getPlacenameQuery(name))
}

export function searchWikidataPerson (name) {
  return queryDispatcher.query(getPersonQuery(name))
}




