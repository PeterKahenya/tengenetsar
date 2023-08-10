from rest_framework import serializers
from ..models import Shared

class SharedSerializer(serializers.ModelSerializer):
	class Meta:
        model = Shared
        fields = "__all__"
        depth=1