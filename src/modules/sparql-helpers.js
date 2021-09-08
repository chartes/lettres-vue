
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

const getPlacenameQuery = name => `SELECT DISTINCT ?item ?label ?coords
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
  ?item wdt:P625 ?coords;


  FILTER(LANG(?label) = "fr")
}
ORDER BY ?label
LIMIT 100`;
//  FILTER CONTAINS(?label, "${name}")

const queryDispatcher = new SPARQLQueryDispatcher(endpointUrl);

export function runWikidataSparqlQuery (query) {
  return queryDispatcher.query(query)
}

export function searchWikidataPlacename (name) {
  return queryDispatcher.query(getPlacenameQuery(name))
}


