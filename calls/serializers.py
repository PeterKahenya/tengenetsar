from rest_framework import serializers
from .models import Call,Chat

class CallSerializer(serializers.ModelSerializer):
    class Meta:
        model=Call
        fields='__all__'
        depth=1

class ChatSerializer(serializers.ModelSerializer):
    class Meta:
        model=Chat
        fields='__all__'