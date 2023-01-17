export function getFhirServerBase() {
    let fhirServerBase = process.env.REACT_APP_FHIR_SERVER_BASE || '';

    if (!fhirServerBase.endsWith('/')) {
        fhirServerBase += '/';
    }

    return fhirServerBase;
}
