export const formaterDate = (timestamp: number) => {

  const date = new Date(timestamp)
return date.toLocaleDateString('fr-Fr')
};


