Projekt został tworzony w oparciu o React, framework Spring Boot oraz bazę danych PosgreSQL.

Zawarte są operacje dodawania, edycji i usuwania danych z bazy. Wszystko wyświetlane jest graficznie na stronie. Stworzony został podział na użytkowników user, moderator, admin z różnymi uprawnieniami.
Pierwszym użytkownikiem jakiego należy stworzyć aby uzyskać dostęp do strony jest admin. Z poziomu konta admina można tworzyć konta moderatorów. Tylko moderator może dodawać i edytować dane z formularzów na stronie głównej.
Projekt jest otwarty na dalsze modyfikacje i będzie dalej rozwijany.

W celu uruchomienia projektu należy uruchomić bazę danych (hasło '123') oraz 
skompilować kod backend (plik FootballappApplication).
Następnie w folderze 'frontend' należy wpisać komendę 'npm install' oraz 'npm start'. 
Strona będzie aktywna pod adresem localhost:3000.