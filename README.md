This project is a full-stack web application for managing and analyzing football data, including matches, teams, players, and statistics.
The application allows users to explore match details, track player performance, view league standings, and predict match results. It also includes a ranking system based on user predictions.
Administrators and moderators have extended capabilities to manage data, update records, and control system content.

## Key Technologies:
- React (frontend)
- Spring Boot (REST API)
- PostgreSQL (database)
- Docker

## Architecture
The application follows a typical client-server architecture:
- The frontend is responsible for the user interface and user interactions
- The backend handles business logic, authentication, and data processing
- Communication is handled via RESTful APIs using JSON format

## Security
- Authentication is handled using JWT tokens
- Passwords are securely hashed using BCrypt
- Role-based access control (RBAC) restricts access to specific functionalities

## Features
### USER:
- Change or recover password using email
- Browse the history of matches with details, including: Events, Statistics, Lineups
- View match schedules
- Predict scores and participate in a ranking system
- View real-time match minute counter
- View team, player and coach detail pages
- View player transfers page
- View league standings and filter matches
- Manage favorite teams, matches, and leagues
- Receive notifications
### MODERATOR:
- Add, search, edit and delete data, including: Teams, Leagues, Matches, Players, Contracts
- Import data from JSON/CSV files
- Manage match statistics, lineups, events (goals, cards, substitutions)
### ADMIN:
- Create moderator and admin accounts
- Delete user accounts
- Reset user passwords
- Send targeted notifications

## Screenshots
### User main page:
![User main page](screenshots/user-homepage.png)
### View responsiveness:
![View responsiveness](screenshots/view-responsiveness.png)
### Match Events:
![Match Events](screenshots/match-events.png)
### Match Statistics:
![Match Statistics](screenshots/match-statistics.png)
### Match Lineups:
![Match Lineups](screenshots/match-lineups.png)
### Score bet page:
![Score bet page](screenshots/score-bet.png)
### Notifications:
![Notifications](screenshots/notifications.png)
### Ranking:
![Ranking](screenshots/ranking.png)
### Transfers page:
![Transfers page](screenshots/transfers-page.png)
### Player page:
![Player page](screenshots/player-page.png)
### Team page:
![Team page](screenshots/team-page.png)
### League standings page1:
![League standings page1](screenshots/league-standings.png)
### League standings page2:
![League standings page2](screenshots/league-standings2.png)
### Search team page:
![Search team page](screenshots/search-team.png)
### Add team page:
![Add team page](screenshots/add-team.png)
### Admin panel:
![Admin panel](screenshots/admin-panel.png)

## Future Improvements:
- Further system expansion and new features
- UI/UX improvements
- Performance optimization
- Additional security enhancements

## Getting Started
1. Clone the repository:
```bash
git clone https://github.com/SzymonKozyra/football-app.git
cd football-app
```
### Option 1: Run with Docker (recommended)
1. Run Docker Desktop
2. Build and run the application:
```bash
docker-compose up --build
```
3. Access the application:
- http://localhost:3000
### Option 2: Run manually
1. Setup database:
- Install PostgreSQL
- Create a database
- Set your database credentials in the backend configuration (application.properties)
2. Run backend:
- Open backend project
- Run main class (FootballappApplication)
3. Run frontend:
```bash
cd frontend
npm install
npm start
```
4. Access the application:
- http://localhost:3000

## Notes
- The first account created in the system must be an ADMIN
- Only ADMIN can create MODERATOR accounts
