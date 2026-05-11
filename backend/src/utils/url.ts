export async function withBaseUrl(path: string | null){
    if(!path) return null;
    return `${process.env.BASE_URL}${path}`;
}

