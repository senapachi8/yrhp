
package Term::Size::Perl::Params; 

# created Thu Dec  8 17:42:18 2022

use vars qw($VERSION);
$VERSION = '0.031';

sub params {
    return (
        winsize => {
            sizeof => 8,
            mask => 'S!S!S!S!'
        },
        TIOCGWINSZ => {
            value => 1074295912,
            definition => qq{((__uint32_t)0x40000000 | ((sizeof(struct winsize) & 0x1fff) << 16) | ((('t')) << 8) | ((104)))}
        }
    );
}

1;

=pod

=head1 NAME

Term::Size::Perl::Params - Configuration for Term::Size::Perl

=head1 SYNOPSIS

    use Term::Size::Perl::Params ();

    %params = Term::Size::Perl::Params::params();

=head1 DESCRIPTION

The configuration parameters C<Term::Size::Perl> needs to
know for retrieving the terminal size with C<ioctl>.

=head1 FUNCTIONS

=head2 params

The configuration parameters C<Term::Size::Perl> needs to
know for retrieving the terminal size with C<ioctl>.

=cut
