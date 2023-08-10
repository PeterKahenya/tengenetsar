import requests

def sendPush(to,roomId):
    # print(to,roomId)
    url = 'https://fcm.googleapis.com/fcm/send'
    json_data = {
        "to": to,
            "data":{
            "title":"Tengeneza Call Request",
            "room_id":roomId,
        },
    }
    headers = {
        "Authorization":"key=AAAAOGOy1tc:APA91bH41zurNt10opqsUz66eNl79KlHgXDNDyiZ4Hzm7pwpmdvk2xz2tHjzQWQ4mPqeEDzldQkjVRJT8IR7eM-y8TNgrgTLMvbl4kTj92AP0Tnq0BF1xQbDuVaXrdqkwyiBHdQBfDjT",
        "Content-Type":"application/json"
    }

    x = requests.post(url, json = json_data, headers=headers)
    print(x)


sendPush("e2RslRi4ErZQ29q225866d:APA91bHG5lIfGNgHxy1EHyL5aOhLhtLBtKlyL_dks9K2f4ea11i6I23y0fPSorNwab7tONO8v8mgCdGMA2vsbSafz3C0brlaojXqLmfin3DuY1pWu9eaRA5UVeHGMmmKPhHTBBuGa2Gx","12345555")