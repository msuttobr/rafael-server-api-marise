create database sensor;
use sensor;

create table medidas (
idMedida int primary key auto_increment,
umidade float,
temperatura_dht11 float,
luminosidade int,
temperatura_lm35 float);

select * from medidas;
desc medidas;