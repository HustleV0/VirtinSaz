from rest_framework import permissions
from .services import SubscriptionService

class HasActiveSubscription(permissions.BasePermission):
    """
    Allows access only to users with an active subscription.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        try:
            return request.user.subscription.status == 'active'
        except:
            return False

class HasFeature(permissions.BasePermission):
    """
    Checks if the user has access to a specific feature.
    """
    def __init__(self, feature_code):
        self.feature_code = feature_code

    def __call__(self):
        return self

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return SubscriptionService.check_feature(request.user, self.feature_code)

def subscription_required(view_func):
    """
    Decorator for views that checks for an active subscription.
    """
    def _wrapped_view(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'Authentication required'}, status=401)
        
        try:
            if request.user.subscription.status != 'active':
                return JsonResponse({'error': 'Active subscription required'}, status=403)
        except:
            return JsonResponse({'error': 'Subscription not found'}, status=403)
            
        return view_func(request, *args, **kwargs)
    return _wrapped_view

class SubscriptionMiddleware:
    """
    Middleware to attach subscription info to the request.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.user.is_authenticated:
            try:
                request.subscription = request.user.subscription
            except:
                request.subscription = None
        else:
            request.subscription = None
            
        response = self.get_response(request)
        return response
