import requests
import json
from django.conf import settings
from django.urls import reverse

class ZarinPalGateway:
    MERCHANT_ID = settings.ZARINPAL_MERCHANT_ID
    SANDBOX = settings.ZARINPAL_SANDBOX
    
    if SANDBOX:
        REQUEST_URL = "https://sandbox.zarinpal.com/pg/rest/WebGate/PaymentRequest.json"
        VERIFY_URL = "https://sandbox.zarinpal.com/pg/rest/WebGate/PaymentVerification.json"
        START_PAY_URL = "https://sandbox.zarinpal.com/pg/StartPay/"
    else:
        REQUEST_URL = "https://www.zarinpal.com/pg/rest/WebGate/PaymentRequest.json"
        VERIFY_URL = "https://www.zarinpal.com/pg/rest/WebGate/PaymentVerification.json"
        START_PAY_URL = "https://www.zarinpal.com/pg/StartPay/"

    @classmethod
    def request_payment(cls, amount, description, email, mobile, callback_url):
        data = {
            "MerchantID": cls.MERCHANT_ID,
            "Amount": int(amount),
            "Description": description,
            "Email": email,
            "Mobile": mobile,
            "CallbackURL": callback_url,
        }
        response = requests.post(cls.REQUEST_URL, json=data)
        result = response.json()
        
        if result['Status'] == 100:
            return {
                'url': cls.START_PAY_URL + str(result['Authority']),
                'authority': result['Authority']
            }
        return None

    @classmethod
    def verify_payment(cls, amount, authority):
        data = {
            "MerchantID": cls.MERCHANT_ID,
            "Amount": int(amount),
            "Authority": authority,
        }
        response = requests.post(cls.VERIFY_URL, json=data)
        result = response.json()
        
        if result['Status'] == 100:
            return {
                'status': True,
                'ref_id': result['RefID']
            }
        return {
            'status': False,
            'status_code': result['Status']
        }
