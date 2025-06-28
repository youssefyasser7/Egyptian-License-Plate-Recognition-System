# accounts/custom_token.py

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from accounts.models import Profile

# class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
#     def validate(self, attrs):
#         data = super().validate(attrs)

#         try:
#             profile = Profile.objects.get(user=self.user)
#             data['user_type'] = profile.type
#         except Profile.DoesNotExist:
#             data['user_type'] = 'user'  # fallback value

#         return data

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        print("=== TOKEN VALIDATION ===")
        try:
            profile = Profile.objects.get(user=self.user)
            print("USER TYPE:", profile.type)
            # data['user_type'] = profile.type
            data.update({
            "userType": profile.type
                        })
        except Profile.DoesNotExist:
            data.update({
            "userType": "user"
            })
        return data