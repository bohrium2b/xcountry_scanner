from django.shortcuts import redirect, render
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect
from django.urls import reverse

# Create your views here.
def index(request):
    # Render the index page
    return render(request, 'account/index.html')


def signup(request):
    if request.method == 'POST':
        # Handle the signup logic here
        username = request.POST.get('username')
        password = request.POST.get('password1')
        # Save the user to the database or perform any other actions
        user = User.objects.create_user(username=username, password=password)
        user.save()
        # Authenticate the user
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            # Redirect to a success page or dashboard
            return HttpResponseRedirect(reverse('account:login_success'))
        else:
            # Handle authentication failure
            return render(request, 'account/signup.html', {'error': 'Authentication failed'})
        return render(request, 'signup_success.html', {'username': username})
    return render(request, 'account/signup.html')

def signup_success(request):
    # Render a success page after signup
    return render(request, 'account/signup_success.html')


def login_view(request):
    if request.method == 'POST':
        # Handle the login logic here
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            # Redirect to a success page or dashboard
            return HttpResponseRedirect(reverse('account:login_success'))
        else:
            # Handle authentication failure
            return render(request, 'account/login.html', {'error': 'Invalid credentials'})
    return render(request, 'account/login.html')


def login_success(request):
    # Render a success page after login
    return render(request, 'account/login_success.html')

def logout_view(request):
    # Handle the logout logic here
    if request.method == 'POST':
        # Perform logout actions
        logout(request)
        # Redirect to a success page or login page
        return render(request, 'account/logout_success.html')
    return render(request, 'account/logout.html')

def logout_success(request):
    # Render a success page after logout
    return render(request, 'account/logout_success.html')

@login_required
def profile_view(request):
    if request.method == 'POST':
        # Handle profile update logic here
        username = request.POST.get('username')
        email = request.POST.get('email')
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        # Update the user's profile or perform any other actions
        user = request.user
        user.username = username if username else user.username
        user.email = email if email else user.email
        user.first_name = first_name if first_name else user.first_name
        user.last_name = last_name if last_name else user.last_name
        # Save the updated user information
        user.save()
        # Redirect to a success page or dashboard
        return redirect('account:profile')
    return render(request, 'account/profile.html')