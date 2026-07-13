from django.shortcuts import render,redirect,get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import Note
from .forms import NoteForm
from .serializers import Noteserializers
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
# Create your views here.
@login_required
def add_note(request):
    if request.method =="POST":
        form = NoteForm(request.POST)
        if form.is_valid():
            note = form.save(commit=False)
            note.user=request.user
            note.save()
            return redirect("note_list")
        
    else:
        form = NoteForm()
    return render(request,"notes/add_note.html",{"form":form})

@login_required
def note_list(request):
    notes=Note.objects.filter(user=request.user)

    return render(request,"notes/note_list.html",{"notes":notes})

@login_required
def edit_note(request,id):
    note = get_object_or_404(Note,id=id,user = request.user)
    if request.method == "POST":
        form= NoteForm(request.POST,instance=note)
        if form.is_valid():
            form.save()
            return redirect("note_list")
    else:
        form = NoteForm()
    return render(request,"notes/add_note.html",{"form":form})

@login_required
def delete_note(request, id):

    note = get_object_or_404(Note,id=id,user=request.user)

    note.delete()

    return redirect("note_list")

class NoteViewSet(ModelViewSet):
    
    serializer_class= Noteserializers
    permission_classes= [IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(user=self.request.user)
    
    def perform_create(self,serializer):
        serializer.save(user=self.request.user)