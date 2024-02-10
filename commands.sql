CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes int DEFAULT 0
);

insert into blogs (author, url, title, likes) values ('Tom', 'www.abc.com', 'About databases', 10);
insert into blogs (author, url, title) values ('Mari', 'www.nodejs.com', 'Node.js tutorial');