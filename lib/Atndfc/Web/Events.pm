package Atndfc::Web::Events;
use Mojo::Base 'Mojolicious::Controller';

# This action will render a template
sub index {
  my $self = shift;
  
  my $start = $self->param("start");
  my $end = $self->param("end");
  my $query = $self->param("query");

  
  
  # Render template "example/welcome.html.ep" with message
  $self->render(json => [{title=>"test",start=>"2013-06-13"},{title=>"test2",start=>"2013-06-14"}]);

}



1;
