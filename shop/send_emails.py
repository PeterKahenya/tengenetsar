from __future__ import absolute_import, unicode_literals
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.utils.html import strip_tags
import uuid
import requests

def send_docs(address,payment,email_address,receipt_path=None,user=None,lpo_path=None):
    print("Sending Emails----------------"+str(payment)+email_address+receipt_path,lpo_path)
    payment_object=payment
    html_message = render_to_string('shop/receipt_email.html', {"payment":payment_object,"user":user,"address":address,"order":address.order})
    plain_message = strip_tags(html_message)
    

    from_email = 'Tengenetsar <info@kipya-africa.com>'
    to = email_address
    bccs = ["peter@kipya-africa.com","stephen@kipya-africa.com"]
    subject="Tengenetsar Order Receipt"

    print(from_email+to+str(bccs)+subject+html_message)

    # data = {
    #         "subject":subject,
    #         "from_email":from_email,
    #         "body":html_message,
    #         "cc":[],
    #         "reply_to":"kahenya0@gmail.com",
    #         "to":[to],
    #         "bcc":bccs,
    #         "attachments":[("RECEIPT.pdf",receipt_path,"application/pdf")]
    # }

    # url = "https://mail.kipya-africa.com/send"

    # response = requests.post(url,data=data)
    try:
        print("Sending RECEIPT")
        message = EmailMessage(subject,html_message,from_email,[to],bccs,headers={'Message-ID': str(uuid.uuid4()) },attachments=[("RECEIPT.pdf",open(receipt_path,"rb").read(),'application/pdf')])
        message.content_subtype = "html"
        message.send()
    except Exception as e:
        print("Exception Sending RECEIPT"+str(e))
        raise e
    

    if lpo_path:
        html_message = render_to_string('shop/lpo_email.html')
        plain_message = strip_tags(html_message)

        from_email = 'Tengenetsar <info@kipya-africa.com>'
        to = "stephen@kipya-africa.com"
        bccs = ["peter@kipya-africa.com","stephen@kipya-africa.com"]
        subject="Tengenetsar LPO"

        # data = {
        #     "subject":subject,
        #     "from_email":from_email,
        #     "body":html_message,
        #     "cc":[],
        #     "reply_to":"kahenya0@gmail.com",
        #     "to":[to],
        #     "bcc":bccs,
        #     "attachments":[("LPO.pdf",lpo_path,"application/pdf")]
        # }

        # url = "https://mail.kipya-africa.com/send"

        # response = requests.post(url,data=data)
        try:
            print("Sending LPO")
            message = EmailMessage(subject,html_message,from_email,[to],bccs,headers={'Message-ID': str(uuid.uuid4()) },attachments=[("LPO.pdf",open(lpo_path,"rb").read(),'application/pdf')])
            message.content_subtype = "html"
            message.send()
        except Exception as e:
            print("Exception send LPO "+str(e))
            raise e
            
    return True