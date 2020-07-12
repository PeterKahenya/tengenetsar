from __future__ import absolute_import, unicode_literals
from celery import shared_task
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.utils.html import strip_tags
import uuid
from shop.models import Payment

def send_receipt(payment,email_address,receipt_path,user,lpo_path=None):
    print(str(payment)+email_address+receipt_path)
    payment_object=Payment.objects.get(id=payment)
    html_message = render_to_string('shop/receipt_email.html', {"payment":payment_object,"user":user})
    plain_message = strip_tags(html_message)
    

    from_email = 'Kipya Africa Limited <info@kipya-africa.com>'
    to = email_address
    bccs = ["peter@kipya-africa.com"]
    subject="Tengenetsar Order Receipt"

    message = EmailMessage(subject,html_message,from_email,[to],bccs,headers={'Message-ID': str(uuid.uuid4()) },attachments=[
                    ("RECEIPT.pdf",open(receipt_path,"rb").read(),'application/pdf'),
    ])
    message.content_subtype = "html"
    message.send()

    if lpo_path:
        html_message = render_to_string('shop/lpo_email.html')
        plain_message = strip_tags(html_message)

        from_email = 'Kipya Africa Limited <info@kipya-africa.com>'
        to = email_address
        bccs = ["peter@kipya-africa.com"]
        subject="Tengenetsar LPO"

        message = EmailMessage(subject,html_message,from_email,[to],bccs,headers={'Message-ID': str(uuid.uuid4()) },attachments=[
                        ("LPO.pdf",open(lpo_path,"rb").read(),'application/pdf'),
        ])
        message.content_subtype = "html"
        message.send()
    return None

# @shared_task
# def mul(x, y):
#     return x * y
