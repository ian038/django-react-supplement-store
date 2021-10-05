from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from base.models import Product, Review
from base.serializers import ProductSerializer
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from rest_framework import status

@api_view(['GET'])
def getProducts(req):
    query = req.query_params.get('keyword')
    if query == None:
        query = ''
    products = Product.objects.filter(name__icontains=query)
    page = req.query_params.get('page')
    paginator = Paginator(products, 12)

    try:
        products = paginator.page(page)
    except PageNotAnInteger:
        products = paginator.page(1)
    except EmptyPage:
        products = paginator.page(paginator.num_pages)

    if page == None:
        page = 1
    
    page = int(page)

    
    serializer = ProductSerializer(products, many=True)
    return Response({ 'products': serializer.data, 'page': page, 'pages': paginator.num_pages })

@api_view(['GET'])
def getTopProducts(req):
    products = Product.objects.filter(rating__gte=4).order_by('-rating')[0:5]
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getProduct(req, pk):
    product = Product.objects.get(_id=pk)
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(req):
    user = req.user
    product = Product.objects.create(
        user = user,
        name = 'Sample Name',
        price = 0,
        brand = 'Sample Brand',
        countInStock = 0,
        category = 'Sample Category',
        description = ''
    )
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(req, pk):
    data = req.data
    product = Product.objects.get(_id=pk)
    product.name = data['name']
    product.price = data['price']
    product.brand = data['brand']
    product.countInStock = data['countInStock']
    product.category = data['category']
    product.description = data['description']
    
    product.save()

    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(req, pk):
    product = Product.objects.get(_id=pk)
    product.delete()
    return Response('Product deleted successfully')

@api_view(['POST'])
def uploadImage(req):
    data = req.data
    product_id = data['product_id']
    product = Product.objects.get(_id=product_id)
    product.image = req.FILES.get('image')
    product.save()
    return Response('Image uploaded successfully')

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProductReview(req, pk):
    user = req.user
    product = Product.objects.get(_id=pk)
    data = req.data
    alreadyExists = product.review_set.filter(user=user).exists()

    if alreadyExists:
        content = { 'detail': 'Product already reviewed' }
        return Response(content, status=status.HTTP_400_BAD_REQUEST)
    elif data['rating'] == 0:
        content = { 'detail': 'Please select a rating' }
        return Response(content, status=status.HTTP_400_BAD_REQUEST)
    else:
        Review.objects.create(
            user = user,
            product = product,
            name = user.first_name,
            rating = data['rating'],
            comment = data['comment']
        )
        reviews = product.review_set.all()
        product.numReviews = len(reviews)

        total = 0
        for r in reviews:
            total += r.rating

        product.rating = total / len(reviews)
        product.save()

    return Response('Review added successfully')