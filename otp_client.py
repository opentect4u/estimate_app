# import requests
# from fastapi import HTTPException

# FIRST_PROJECT_BASE_URL = "http://127.0.0.1:8000"  # Replace with the actual URL

# def request_otp(phone_no: int):
#     """
#     Calls the first project's API to generate an OTP and send it via SMS.
#     :param phone_no: The phone number for which to generate an OTP.
#     :return: The response from the first project's API.
#     """
#     url = f"{FIRST_PROJECT_BASE_URL}/api/otp/{phone_no}"
#     try:
#         response = requests.post(url)
#         if response.status_code == 200:
#             return response.json()  # Assuming the API returns JSON
#         else:
#             raise HTTPException(
#                 status_code=response.status_code,
#                 detail=f"Failed to get OTP: {response.text}"
#             )
#     except requests.RequestException as e:
#         raise HTTPException(status_code=500, detail=f"Error connecting to OTP API: {str(e)}")
