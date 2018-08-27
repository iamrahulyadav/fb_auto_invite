# FB Auto Inviter

Invite people to like the Facebook page you manage.

## Installation

1. Clone the repository
2. Edit credentials.js, set it to use your FB username and password
3. Run `npm install`

## Running

Run:

`node like.js [your_facebook_page_id]`

## TODO

- Delays are set, but are arbitrary. They won't work on slower connections, for instance.
- The code is dirty. It should be refactored in the future.
- Only works on Dutch Facebook, as it looks for the text "Uitnodigen" (Invite).

## LICENSE

GPLv3
