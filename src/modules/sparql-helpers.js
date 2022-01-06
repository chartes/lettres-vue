
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

const getPlacenameQuery = name => `SELECT DISTINCT ?item ?label ?paysLabel ?coords
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
LIMIT 50`;
//  FILTER CONTAINS(?label, "${name}")


const getPersonQuery = name => `SELECT DISTINCT ?item ?label 
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
  ?item rdfs:label ?label;

  FILTER(LANG(?label) = "fr")
  service wikibase:label {bd:serviceParam wikibase:language  "fr","en".}
}
ORDER BY ?label 
LIMIT 50`;

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




