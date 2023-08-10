from django.contrib import admin
from django.urls import path,re_path,include
from django.contrib.auth.models import User
from .viewsets.products import *
from .viewsets.orders import *
from .viewsets.login import TengenetsarLoginView
from .viewsets.mpesa import *
from .viewsets.shared import CreateSharedLink,GetSharedCart

urlpatterns = [
    path('products',AllProductsListView.as_view(),name="products-list"),
    path('products/<uuid:pk>/details',ProductDetailView.as_view(),name="product-details"),
    path('products/search',ProductsSearchView.as_view(),name="products-search"),
    path('products/sort',ProductsOrderingView.as_view(),name="products-sort"),
    path('products/filter',ProductsFilterView.as_view(),name="products-filter"),
    path('categories',AllCategoriesListView.as_view(),name="categories-list"),
    path('categories/<uuid:pk>/products',CategoryProducts.as_view(),name="category-products"),
    
    path('categories/<uuid:pk>/details',CategoryDetailView.as_view(),name="category-details"),

    path('login',TengenetsarLoginView.as_view(),name="login"),

    path('cart',CartView.as_view(),name="cart"),
    path('checkout',CheckoutView.as_view(),name="checkout"),
    path('payment/payment-method-one/add',AddMPESAPaymentView.as_view(),name="add-mpesa-payment"),
    path('payment/payment-method-one/check',CheckMPESAPaymentView.as_view(),name="check-mpesa-payment"),
    path('addresses',ShippingAddressView.as_view()),
    path('get_shareable_link',CreateSharedLink.as_view(),name="get-shareable-link"),
    path('get_shared_items',GetSharedCart.as_view(),name="get-shared-items"),




]