
export const getToken = () => {
  return localStorage.getItem("user") ;
};


export const setToken = (user) => {
  localStorage.setItem("user", user);
};


