from django.urls import path
from base.views import order_views as views

urlpatterns = [
    path('', views.getOrders, name='myorders'),
    path('add/', views.addOrderItems, name='add-orders'),
    path('myorders/', views.getMyOrders, name='myorders'),
    path('<str:pk>/deliver/', views.updateOrderToDelivered, name='deliver'),
    path('<str:pk>/', views.getOrderById, name='user-order'),
    path('<str:pk>/pay/', views.updateOrderToPaid, name='pay')
]