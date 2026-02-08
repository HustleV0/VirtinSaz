import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from subscription.models import Plan, Feature

def create_initial_data():
    # Features
    unlimited, _ = Feature.objects.get_or_create(code='unlimited_sites', name='سایت نامحدود')
    support, _ = Feature.objects.get_or_create(code='priority_support', name='پشتیبانی اختصاصی')
    
    # Plans
    Plan.objects.get_or_create(
        name='رایگان', 
        price=0, 
        is_default=True, 
        features_list=['limited_access'], 
        limits={'max_sites': 1}
    )
    
    Plan.objects.get_or_create(
        name='اقتصادی', 
        price=199000, 
        features_list=['unlimited_sites'], 
        limits={'max_sites': 5}
    )
    
    Plan.objects.get_or_create(
        name='حرفه‌ای', 
        price=499000, 
        features_list=['unlimited_sites', 'priority_support'], 
        limits={'max_sites': 20}
    )
    print("Initial subscription data created successfully.")

if __name__ == '__main__':
    create_initial_data()
