from __future__ import absolute_import, unicode_literals
from celery import shared_task
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.utils.html import strip_tags
import uuid


@shared_task
def send_receipt(payment,user,receipt_path):

    html_message = render_to_string('shop/receipt_email.html', {"user":user,"payment":payment,"scheme":scheme,"host":host})
    plain_message = strip_tags(html_message)
    

    from_email = 'Kipya Africa Limited <info@kipya-africa.com>'
    to = user.email
    bccs = ["info@kipya-africa.com","stephen@kipya-africa.com"]
    subject="Tengenetsar Order Receipt"

    message = EmailMessage(subject,html_message,from_email,[to],bccs,headers={'Message-ID': str(uuid.uuid4()) },attachments=[
                    ("RECEIPT.pdf",open(receipt_path,"rb").read(),'application/pdf'),
    ])
    message.content_subtype = "html"
    message.send()
    newsletter.is_sent=True
    newsletter.save()
    return None

# @shared_task
# def mul(x, y):
#     return x * y
