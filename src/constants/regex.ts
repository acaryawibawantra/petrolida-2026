export const REG_EMAIL =
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

// Using +62 as prefix is NOT required anymore
export const REG_PHONE = /^\+?[\d\s-]{7,20}$/;
export const REG_PHONE_INTERNATIONAL = /^\+?[1-9]\d{1,14}$/;

export const REG_NRP = /^(50|20)\d{2}(25|24|23)1\d{3}$/;
export const REG_PASS = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
