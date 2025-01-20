import axios from "axios";

const Zibal = axios.create({
  baseURL: "https://api.zibal.ir",
  headers: {
    "Content-Type": "application/json",
    'Access-Control-Allow-Origin': '*',
    Authorization: `Bearer ${process.env.ZIBAL_API_KEY}`,
  },
});

export async function getFacilityIbanInquiry(IBAN: string) {
  const response = await Zibal.post(`/v1/facility/ibanInquiry`, {
    data: {
      IBAN: IBAN,
      separated: true,
    },
  });
  const res = response.data;
  console.log(res);
  return res;
}
