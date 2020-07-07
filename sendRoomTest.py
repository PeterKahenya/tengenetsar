import requests

url = 'https://fcm.googleapis.com/fcm/send'
json = {
    "to": "fCbnZZkznLoNFwQ-y1BegI:APA91bE16DEH9eZYLHG6Pch8r9or1CkYBGjyiqBBCWEVg671CRZsWO5TrchUkS8hO2TVy4RWzRL2AwlpgAuJWf1465VMa5sxOsn3YP2wEZUnIrJK2Vf2mhL6WWzIA0fnMF3FS5tznqv_",
    "notification":{
        "title":"Calling All the Messangers"
    },
}
headers = {
    "Authorization":"key=AAAAOGOy1tc:APA91bH41zurNt10opqsUz66eNl79KlHgXDNDyiZ4Hzm7pwpmdvk2xz2tHjzQWQ4mPqeEDzldQkjVRJT8IR7eM-y8TNgrgTLMvbl4kTj92AP0Tnq0BF1xQbDuVaXrdqkwyiBHdQBfDjT",
    "Content-Type":"application/json"
}

x = requests.post(url, json = json, headers=headers)

print(x.text)