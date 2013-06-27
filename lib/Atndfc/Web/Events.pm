package Atndfc::Web::Events;
use Mojo::Base 'Mojolicious::Controller';
use WebService::Simple;
use Data::Dumper;

# This action will render a template
sub index {
  my $self = shift;
  
  my $start = $self->param("start");
  my $end = $self->param("end");
  my $query = $self->param("query");

  $query =~ s/\s+/,/g;

    my $atnd = WebService::Simple->new(
           base_url => "http://api.atnd.org/events/",
           param    => { format => "json", keyword => $query, count=>100},
           response_parser => 'JSON',
    );

    my $response   = $atnd->get();

    
    my $json = $response->parse_response;

    $self->app->log->debug (Dumper($json));
    my @events = @{$json->{events}};
  my @json =();
  for my $event(@events){
      push @json, { title => $event->{"title"}, start => $event->{"started_at"}, end => $event->{"ended_at"}};
  }

  $self->render(json => \@json);

}



1;
