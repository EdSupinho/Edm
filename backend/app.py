from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime, timedelta
import os
import requests
import json
import jwt as pyjwt
import hashlib
from functools import wraps
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity

app = Flask(__name__)

# Configurações de ambiente
basedir = os.path.abspath(os.path.dirname(__file__))
database_url = os.environ.get('DATABASE_URL', f'sqlite:///{os.path.join(basedir, "loja.db")}')

app.config['SQLALCHEMY_DATABASE_URI'] = database_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# CORS - permite todas as origens em produção ou lista específica
allowed_origins = os.environ.get('ALLOWED_ORIGINS', 'http://localhost:8081,http://localhost:3000,http://127.0.0.1:8081,http://127.0.0.1:3000')
origins_list = [origin.strip() for origin in allowed_origins.split(',')] if allowed_origins else ['*']

CORS(app, 
     origins=origins_list if '*' not in origins_list else ['*'],
     allow_headers=['Content-Type', 'Authorization'],
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])

@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = jsonify({})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add('Access-Control-Allow-Headers', "*")
        response.headers.add('Access-Control-Allow-Methods', "*")
        return response

@app.after_request
def after_request(response):
    origin = request.headers.get('Origin')
    if origin and (origin in origins_list or '*' in origins_list):
        response.headers.add('Access-Control-Allow-Origin', origin)
    elif '*' in origins_list:
        response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'sua_chave_secreta_super_segura_2024')
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', os.environ.get('SECRET_KEY', 'sua_chave_secreta_super_segura_2024'))
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)
app.config['JWT_TOKEN_LOCATION'] = ['headers']
app.config['JWT_HEADER_NAME'] = 'Authorization'
app.config['JWT_HEADER_TYPE'] = 'Bearer'
jwt_manager = JWTManager(app)
JWT_SECRET = app.config['SECRET_KEY']

class Categoria(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    descricao = db.Column(db.Text)
    produtos = db.relationship('Produto', backref='categoria', lazy=True)

class Produto(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(200), nullable=False)
    descricao = db.Column(db.Text)
    preco = db.Column(db.Float, nullable=False)
    estoque = db.Column(db.Integer, default=0)
    imagem_url = db.Column(db.String(500))
    categoria_id = db.Column(db.Integer, db.ForeignKey('categoria.id'))
    ativo = db.Column(db.Boolean, default=True)
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)

class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    telefone = db.Column(db.String(20))
    endereco = db.Column(db.Text)
    senha_hash = db.Column(db.String(128))
    is_admin = db.Column(db.Boolean, default=False)
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    data_nascimento = db.Column(db.Date)
    genero = db.Column(db.String(10))  # M, F, Outro
    avatar_url = db.Column(db.String(200))
    ativo = db.Column(db.Boolean, default=True)

class Pedido(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'))
    total = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), default='pendente')
    data_pedido = db.Column(db.DateTime, default=datetime.utcnow)
    data_atualizacao = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    nome_cliente = db.Column(db.String(100))
    email_cliente = db.Column(db.String(120))
    telefone_cliente = db.Column(db.String(20))
    endereco_entrega = db.Column(db.Text)
    cidade_entrega = db.Column(db.String(100))
    cep_entrega = db.Column(db.String(10))
    observacoes = db.Column(db.Text)
    
    itens = db.relationship('ItemPedido', backref='pedido', lazy=True)

class ItemPedido(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    pedido_id = db.Column(db.Integer, db.ForeignKey('pedido.id'))
    produto_id = db.Column(db.Integer, db.ForeignKey('produto.id'))
    quantidade = db.Column(db.Integer, nullable=False)
    preco_unitario = db.Column(db.Float, nullable=False)
    produto = db.relationship('Produto', backref='itens_pedido')

class Favorito(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
    produto_id = db.Column(db.Integer, db.ForeignKey('produto.id'), nullable=False)
    data_favorito = db.Column(db.DateTime, default=datetime.utcnow)
    
    usuario = db.relationship('Usuario', backref='favoritos')
    produto = db.relationship('Produto', backref='favoritos')
    
    __table_args__ = (db.UniqueConstraint('usuario_id', 'produto_id', name='unique_favorito'),)

class Administrador(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    senha_hash = db.Column(db.String(128), nullable=False)
    ativo = db.Column(db.Boolean, default=True)
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    ultimo_login = db.Column(db.DateTime)

def hash_senha(senha):
    """Gera hash da senha usando SHA-256"""
    return hashlib.sha256(senha.encode()).hexdigest()

def verificar_senha(senha, senha_hash):
    """Verifica se a senha está correta"""
    return hash_senha(senha) == senha_hash

def gerar_token(admin_id):
    """Gera token JWT para o administrador"""
    payload = {
        'admin_id': admin_id,
        'exp': datetime.utcnow() + timedelta(hours=24)
    }
    return pyjwt.encode(payload, JWT_SECRET, algorithm='HS256')

def verificar_token(token):
    """Verifica se o token é válido"""
    try:
        payload = pyjwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        return payload['admin_id']
    except pyjwt.ExpiredSignatureError:
        return None
    except pyjwt.InvalidTokenError:
        return None

def admin_required(f):
    """Decorator para proteger rotas administrativas"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'erro': 'Token de acesso necessário'}), 401
        
        if token.startswith('Bearer '):
            token = token[7:]
        
        print(f"DEBUG: Token recebido: {token[:20]}...")
        admin_id = verificar_token(token)
        print(f"DEBUG: admin_id extraído: {admin_id}")
        
        if not admin_id:
            return jsonify({'erro': 'Token inválido ou expirado'}), 401
        
        admin = Administrador.query.get(admin_id)
        if not admin or not admin.ativo:
            return jsonify({'erro': 'Administrador não encontrado ou inativo'}), 401
        
        return f(*args, **kwargs)
    return decorated_function

FAKE_STORE_API = 'https://fakestoreapi.com'

PRODUTOS_PORTUGUES = [
    # Eletrônicos
    {"nome": "Smartphone Samsung Galaxy A54", "descricao": "Smartphone com câmera de 50MP, tela de 6.4 polegadas e bateria de 5000mAh", "preco": 25000, "categoria": "Eletrônicos", "imagem": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop"},
    {"nome": "iPhone 15 Pro", "descricao": "Smartphone Apple com chip A17 Pro, câmera de 48MP e tela Super Retina XDR", "preco": 45000, "categoria": "Eletrônicos", "imagem": "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop"},
    {"nome": "Laptop Dell Inspiron 15", "descricao": "Notebook com processador Intel i5, 8GB RAM, 256GB SSD e tela de 15.6 polegadas", "preco": 35000, "categoria": "Eletrônicos", "imagem": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop"},
    {"nome": "Tablet iPad Air", "descricao": "Tablet Apple com chip M1, tela Liquid Retina de 10.9 polegadas e suporte ao Apple Pencil", "preco": 28000, "categoria": "Eletrônicos", "imagem": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop"},
    {"nome": "Smartwatch Apple Watch", "descricao": "Relógio inteligente com GPS, monitor de saúde e resistência à água", "preco": 12000, "categoria": "Eletrônicos", "imagem": "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=300&h=300&fit=crop"},
    {"nome": "Fones de Ouvido Sony WH-1000XM4", "descricao": "Fones sem fio com cancelamento de ruído e bateria de 30 horas", "preco": 8000, "categoria": "Eletrônicos", "imagem": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop"},
    {"nome": "Câmera Canon EOS R6", "descricao": "Câmera mirrorless profissional com sensor full-frame de 20MP", "preco": 55000, "categoria": "Eletrônicos", "imagem": "https://images.unsplash.com/photo-1502920917122-1aa500764cbd?w=300&h=300&fit=crop"},
    {"nome": "TV Samsung 55 polegadas", "descricao": "Smart TV 4K com HDR, sistema Tizen e conexão Wi-Fi", "preco": 32000, "categoria": "Eletrônicos", "imagem": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=300&fit=crop"},
    {"nome": "PlayStation 5", "descricao": "Console de videogame com SSD ultra-rápido e ray tracing", "preco": 40000, "categoria": "Eletrônicos", "imagem": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=300&h=300&fit=crop"},
    {"nome": "Xbox Series X", "descricao": "Console Microsoft com processador AMD Zen 2 e 1TB de armazenamento", "preco": 38000, "categoria": "Eletrônicos", "imagem": "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=300&h=300&fit=crop"},
    
    # Roupas Masculinas
    {"nome": "Camisa Polo Lacoste", "descricao": "Camisa polo de algodão penteado com logo bordado", "preco": 1200, "categoria": "Roupas Masculinas", "imagem": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop"},
    {"nome": "Calça Jeans Levis 501", "descricao": "Calça jeans clássica em denim azul com corte regular", "preco": 1800, "categoria": "Roupas Masculinas", "imagem": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300&h=300&fit=crop"},
    {"nome": "Tênis Nike Air Max", "descricao": "Tênis esportivo com tecnologia Air Max e solado em borracha", "preco": 2500, "categoria": "Roupas Masculinas", "imagem": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop"},
    {"nome": "Jaqueta de Couro", "descricao": "Jaqueta de couro legítimo com forro interno e zíper", "preco": 4500, "categoria": "Roupas Masculinas", "imagem": "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop"},
    {"nome": "Terno Hugo Boss", "descricao": "Terno de lã com corte slim, paletó e calça", "preco": 8000, "categoria": "Roupas Masculinas", "imagem": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop"},
    {"nome": "Relógio Rolex Submariner", "descricao": "Relógio de mergulho com caixa de aço inoxidável e resistência à água", "preco": 25000, "categoria": "Roupas Masculinas", "imagem": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop"},
    {"nome": "Cinto de Couro", "descricao": "Cinto de couro legítimo com fivela de metal", "preco": 800, "categoria": "Roupas Masculinas", "imagem": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop"},
    {"nome": "Óculos de Sol Ray-Ban", "descricao": "Óculos de sol com lentes polarizadas e armação de acetato", "preco": 1500, "categoria": "Roupas Masculinas", "imagem": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=300&h=300&fit=crop"},
    
    # Roupas Femininas
    {"nome": "Vestido de Festa", "descricao": "Vestido elegante para ocasiões especiais em tecido premium", "preco": 2200, "categoria": "Roupas Femininas", "imagem": "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=300&fit=crop"},
    {"nome": "Blusa de Seda", "descricao": "Blusa de seda natural com corte clássico e botões de madrepérola", "preco": 1800, "categoria": "Roupas Femininas", "imagem": "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop"},
    {"nome": "Calça Social Feminina", "descricao": "Calça social em tecido stretch com corte moderno", "preco": 1500, "categoria": "Roupas Femininas", "imagem": "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=300&h=300&fit=crop"},
    {"nome": "Sapato de Salto Alto", "descricao": "Sapato de salto alto em couro com salto de 8cm", "preco": 2000, "categoria": "Roupas Femininas", "imagem": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&h=300&fit=crop"},
    {"nome": "Bolsa de Couro", "descricao": "Bolsa de couro legítimo com alça ajustável e compartimentos internos", "preco": 2800, "categoria": "Roupas Femininas", "imagem": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop"},
    {"nome": "Biquíni de Praia", "descricao": "Conjunto de biquíni em lycra com estampa tropical", "preco": 1200, "categoria": "Roupas Femininas", "imagem": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop"},
    {"nome": "Casaco de Inverno", "descricao": "Casaco quente para inverno com capuz e bolsos", "preco": 3500, "categoria": "Roupas Femininas", "imagem": "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop"},
    {"nome": "Pulseira de Prata", "descricao": "Pulseira de prata 925 com pingente de coração", "preco": 800, "categoria": "Roupas Femininas", "imagem": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop"},
    
    # Casa e Jardim
    {"nome": "Sofá 3 Lugares", "descricao": "Sofá confortável em tecido cinza com almofadas decorativas", "preco": 12000, "categoria": "Casa e Jardim", "imagem": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop"},
    {"nome": "Mesa de Jantar", "descricao": "Mesa de jantar para 6 pessoas em madeira maciça", "preco": 8000, "categoria": "Casa e Jardim", "imagem": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop"},
    {"nome": "Cama King Size", "descricao": "Cama king size com cabeceira estofada e colchão de molas", "preco": 15000, "categoria": "Casa e Jardim", "imagem": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop"},
    {"nome": "Geladeira Brastemp", "descricao": "Geladeira frost-free com 300L de capacidade", "preco": 18000, "categoria": "Casa e Jardim", "imagem": "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=300&h=300&fit=crop"},
    {"nome": "Fogão 4 Bocas", "descricao": "Fogão a gás com 4 bocas e forno elétrico", "preco": 2500, "categoria": "Casa e Jardim", "imagem": "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=300&h=300&fit=crop"},
    {"nome": "Micro-ondas 30L", "descricao": "Micro-ondas com 30 litros de capacidade e 10 níveis de potência", "preco": 1800, "categoria": "Casa e Jardim", "imagem": "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=300&h=300&fit=crop"},
    {"nome": "Liquidificador", "descricao": "Liquidificador com 1000W de potência e jarra de vidro", "preco": 800, "categoria": "Casa e Jardim", "imagem": "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=300&h=300&fit=crop"},
    {"nome": "Aspirador de Pó", "descricao": "Aspirador de pó vertical com filtro HEPA", "preco": 1200, "categoria": "Casa e Jardim", "imagem": "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=300&h=300&fit=crop"},
    {"nome": "Vaso de Planta", "descricao": "Vaso de cerâmica para plantas com dreno", "preco": 300, "categoria": "Casa e Jardim", "imagem": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=300&fit=crop"},
    
    # Esportes
    {"nome": "Bicicleta Mountain Bike", "descricao": "Bicicleta para trilhas com 21 marchas e freios a disco", "preco": 12000, "categoria": "Esportes", "imagem": "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop"},
    {"nome": "Tênis de Corrida Nike", "descricao": "Tênis esportivo com tecnologia Air Max para corrida", "preco": 2800, "categoria": "Esportes", "imagem": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop"},
    {"nome": "Roupa de Academia", "descricao": "Conjunto de treino em dry-fit com short e camiseta", "preco": 1200, "categoria": "Esportes", "imagem": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop"},
    {"nome": "Halteres 20kg", "descricao": "Par de halteres ajustáveis de 20kg para musculação", "preco": 2500, "categoria": "Esportes", "imagem": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop"},
    {"nome": "Bola de Futebol", "descricao": "Bola de futebol oficial com tecnologia Nike", "preco": 800, "categoria": "Esportes", "imagem": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop"},
    {"nome": "Raquete de Tênis", "descricao": "Raquete de tênis profissional com cordas de alta qualidade", "preco": 1800, "categoria": "Esportes", "imagem": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop"},
    {"nome": "Óculos de Natação", "descricao": "Óculos de natação com lentes anti-embaçamento", "preco": 400, "categoria": "Esportes", "imagem": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop"},
    {"nome": "Corda de Pular", "descricao": "Corda de pular ajustável com contador de pulos", "preco": 200, "categoria": "Esportes", "imagem": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop"},
    {"nome": "Esteira Elétrica", "descricao": "Esteira elétrica com inclinação e programas de treino", "preco": 15000, "categoria": "Esportes", "imagem": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop"},
    
    # Joias
    {"nome": "Anel de Ouro 18k", "descricao": "Anel de ouro 18 quilates com design clássico", "preco": 5000, "categoria": "Joias", "imagem": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop"},
    {"nome": "Colar de Diamante", "descricao": "Colar com pingente de diamante em ouro branco", "preco": 25000, "categoria": "Joias", "imagem": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop"},
    {"nome": "Brinco de Pérola", "descricao": "Brinco de pérola natural com fecho de ouro", "preco": 3500, "categoria": "Joias", "imagem": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop"},
    {"nome": "Pulseira de Ouro", "descricao": "Pulseira de ouro 18k com elos entrelaçados", "preco": 8000, "categoria": "Joias", "imagem": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop"},
    {"nome": "Relógio de Ouro", "descricao": "Relógio de pulso em ouro com mostrador analógico", "preco": 18000, "categoria": "Joias", "imagem": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop"},
    {"nome": "Aliança de Casamento", "descricao": "Aliança de ouro 18k para casamento", "preco": 4500, "categoria": "Joias", "imagem": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop"},
    {"nome": "Broche de Diamante", "descricao": "Broche decorativo com diamantes e ouro", "preco": 12000, "categoria": "Joias", "imagem": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop"},
    {"nome": "Pingente de Esmeralda", "descricao": "Pingente de esmeralda natural em ouro", "preco": 15000, "categoria": "Joias", "imagem": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop"},
    
    # Livros
    {"nome": "Livro: A Arte da Guerra", "descricao": "Clássico de Sun Tzu sobre estratégia militar", "preco": 800, "categoria": "Livros", "imagem": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=300&fit=crop"},
    {"nome": "Livro: O Pequeno Príncipe", "descricao": "Obra clássica de Antoine de Saint-Exupéry", "preco": 600, "categoria": "Livros", "imagem": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=300&fit=crop"},
    {"nome": "Livro: Dom Casmurro", "descricao": "Romance de Machado de Assis", "preco": 500, "categoria": "Livros", "imagem": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=300&fit=crop"},
    {"nome": "Livro: 1984", "descricao": "Distopia clássica de George Orwell", "preco": 700, "categoria": "Livros", "imagem": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=300&fit=crop"},
    {"nome": "Livro: Harry Potter", "descricao": "Série completa de J.K. Rowling", "preco": 2000, "categoria": "Livros", "imagem": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=300&fit=crop"},
    {"nome": "Livro: A Culpa é das Estrelas", "descricao": "Romance de John Green", "preco": 400, "categoria": "Livros", "imagem": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=300&fit=crop"},
    {"nome": "Livro: O Alquimista", "descricao": "Fábula de Paulo Coelho", "preco": 450, "categoria": "Livros", "imagem": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=300&fit=crop"},
    {"nome": "Livro: Cem Anos de Solidão", "descricao": "Clássico de Gabriel García Márquez", "preco": 600, "categoria": "Livros", "imagem": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=300&fit=crop"},
    {"nome": "Livro: O Senhor dos Anéis", "descricao": "Trilogia completa de J.R.R. Tolkien", "preco": 1800, "categoria": "Livros", "imagem": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=300&fit=crop"},
    {"nome": "Livro: A Menina que Roubava Livros", "descricao": "Romance de Markus Zusak", "preco": 500, "categoria": "Livros", "imagem": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=300&fit=crop"},
]

def buscar_produtos_externos():
    """Busca produtos da Fake Store API"""
    try:
        response = requests.get(f'{FAKE_STORE_API}/products')
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f'Erro ao buscar produtos externos: {e}')
        return []

def buscar_categorias_externas():
    """Busca categorias da Fake Store API"""
    try:
        response = requests.get(f'{FAKE_STORE_API}/products/categories')
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f'Erro ao buscar categorias externas: {e}')
        return []

def sincronizar_dados_externos():
    """Sincroniza dados da API externa com o banco local"""
    try:
        produtos_externos = buscar_produtos_externos()
        categorias_externas = buscar_categorias_externas()
        
        Produto.query.delete()
        Categoria.query.delete()
        
        for i, cat_nome in enumerate(categorias_externas, 1):
            categoria = Categoria(
                id=i,
                nome=cat_nome.title(),
                descricao=f'Produtos da categoria {cat_nome.title()}'
            )
            db.session.add(categoria)
        
        db.session.flush()
        
        for produto_ext in produtos_externos:
            categoria_id = 1  
            if produto_ext['category'] in categorias_externas:
                categoria_id = categorias_externas.index(produto_ext['category']) + 1
            
            produto = Produto(
                nome=produto_ext['title'],
                descricao=produto_ext['description'],
                preco=float(produto_ext['price']),
                estoque=100,  
                imagem_url=produto_ext['image'],
                categoria_id=categoria_id,
                ativo=True
            )
            db.session.add(produto)
        
        db.session.commit()
        return True
    except Exception as e:
        print(f'Erro ao sincronizar dados: {e}')
        db.session.rollback()
        return False

def sincronizar_produtos_portugues():
    """Sincroniza produtos em português com valores em meticais"""
    try:
        Produto.query.delete()
        Categoria.query.delete()
        
        categorias = [
            {"nome": "Eletrônicos", "descricao": "Smartphones, laptops, tablets e acessórios"},
            {"nome": "Roupas Masculinas", "descricao": "Camisas, calças, tênis e acessórios masculinos"},
            {"nome": "Roupas Femininas", "descricao": "Vestidos, blusas, sapatos e acessórios femininos"},
            {"nome": "Casa e Jardim", "descricao": "Móveis, eletrodomésticos e decoração"},
            {"nome": "Esportes", "descricao": "Equipamentos esportivos e roupas de academia"},
            {"nome": "Joias", "descricao": "Anéis, colares, relógios e acessórios de luxo"},
            {"nome": "Livros", "descricao": "Livros de literatura, ficção e não-ficção"}
        ]
        
        for i, cat in enumerate(categorias, 1):
            categoria = Categoria(
                id=i,
                nome=cat["nome"],
                descricao=cat["descricao"]
            )
            db.session.add(categoria)
        
        db.session.flush()
        
        for produto_data in PRODUTOS_PORTUGUES:
            categoria_id = 1  # Default
            for i, cat in enumerate(categorias, 1):
                if cat["nome"] == produto_data["categoria"]:
                    categoria_id = i
                    break
            
            produto = Produto(
                nome=produto_data["nome"],
                descricao=produto_data["descricao"],
                preco=float(produto_data["preco"]),
                estoque=100,  # Estoque padrão
                imagem_url=produto_data["imagem"],
                categoria_id=categoria_id,
                ativo=True
            )
            db.session.add(produto)
        
        db.session.commit()
        return True
    except Exception as e:
        print(f'Erro ao sincronizar produtos em português: {e}')
        db.session.rollback()
        return False


@app.route('/api/sync', methods=['POST'])
def sincronizar_api():
    """Endpoint para sincronizar com API externa"""
    if sincronizar_dados_externos():
        return jsonify({'mensagem': 'Dados sincronizados com sucesso!'})
    else:
        return jsonify({'erro': 'Falha ao sincronizar dados'}), 500

@app.route('/api/sync-portugues', methods=['POST'])
def sincronizar_portugues():
    """Endpoint para sincronizar com produtos em português"""
    if sincronizar_produtos_portugues():
        return jsonify({'mensagem': 'Produtos em português sincronizados com sucesso!'})
    else:
        return jsonify({'erro': 'Falha ao sincronizar produtos em português'}), 500

@app.route('/api/status', methods=['GET'])
def status_api():
    """Endpoint para verificar status da API"""
    try:
        response = requests.get(f'{FAKE_STORE_API}/products?limit=1', timeout=5)
        api_status = response.status_code == 200
        
        produtos_count = Produto.query.count()
        categorias_count = Categoria.query.count()
        
        return jsonify({
            'api_externa_online': api_status,
            'produtos_locais': produtos_count,
            'categorias_locais': categorias_count,
            'ultima_sincronizacao': 'N/A'  
        })
    except:
        return jsonify({
            'api_externa_online': False,
            'produtos_locais': Produto.query.count(),
            'categorias_locais': Categoria.query.count(),
            'ultima_sincronizacao': 'N/A'
        })

@app.route('/api/categorias', methods=['GET'])
def get_categorias():
    categorias = Categoria.query.all()
    return jsonify([{
        'id': cat.id,
        'nome': cat.nome,
        'descricao': cat.descricao
    } for cat in categorias])

@app.route('/api/produtos', methods=['GET'])
def get_produtos():
    categoria_id = request.args.get('categoria_id')
    busca = request.args.get('busca')
    
    query = Produto.query.filter_by(ativo=True)
    
    if categoria_id:
        query = query.filter_by(categoria_id=categoria_id)
    
    if busca:
        query = query.filter(Produto.nome.contains(busca))
    
    produtos = query.all()
    return jsonify([{
        'id': prod.id,
        'nome': prod.nome,
        'descricao': prod.descricao,
        'preco': prod.preco,
        'estoque': prod.estoque,
        'imagem_url': prod.imagem_url,
        'categoria_id': prod.categoria_id,
        'categoria_nome': prod.categoria.nome if prod.categoria else None
    } for prod in produtos])

@app.route('/api/produtos/<int:produto_id>', methods=['GET'])
def get_produto(produto_id):
    produto = Produto.query.get_or_404(produto_id)
    return jsonify({
        'id': produto.id,
        'nome': produto.nome,
        'descricao': produto.descricao,
        'preco': produto.preco,
        'estoque': produto.estoque,
        'imagem_url': produto.imagem_url,
        'categoria_id': produto.categoria_id,
        'categoria_nome': produto.categoria.nome if produto.categoria else None
    })

@app.route('/api/usuarios', methods=['POST'])
def criar_usuario():
    data = request.get_json()
    usuario = Usuario(
        nome=data['nome'],
        email=data['email'],
        telefone=data.get('telefone'),
        endereco=data.get('endereco')
    )  
    db.session.add(usuario)
    db.session.commit()
    return jsonify({'id': usuario.id, 'mensagem': 'Usuário criado com sucesso'})


@app.route('/api/usuarios/<int:usuario_id>', methods=['GET'])
def get_usuario(usuario_id):
    usuario = Usuario.query.get_or_404(usuario_id)
    return jsonify({
        'id': usuario.id,
        'nome': usuario.nome,
        'email': usuario.email,
        'telefone': usuario.telefone,
        'endereco': usuario.endereco
    })


@app.route('/api/pedidos/usuario/<int:usuario_id>', methods=['GET'])
def get_pedidos_usuario(usuario_id):
    pedidos = Pedido.query.filter_by(usuario_id=usuario_id).all()
    return jsonify([{
        'id': pedido.id,
        'total': pedido.total,
        'status': pedido.status,
        'data_pedido': pedido.data_pedido.isoformat(),
        'itens': [{
            'produto_id': item.produto_id,
            'produto_nome': item.produto.nome,
            'quantidade': item.quantidade,
            'preco_unitario': item.preco_unitario
        } for item in pedido.itens]
    } for pedido in pedidos])

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    username = data.get('username')
    senha = data.get('senha')
    
    if not username or not senha:
        return jsonify({'erro': 'Username e senha são obrigatórios'}), 400
    
    admin = Administrador.query.filter_by(username=username, ativo=True).first()
    
    if not admin or not verificar_senha(senha, admin.senha_hash):
        return jsonify({'erro': 'Credenciais inválidas'}), 401
    
    admin.ultimo_login = datetime.utcnow()
    db.session.commit()
    
    token = gerar_token(admin.id)
    
    return jsonify({
        'token': token,
        'admin': {
            'id': admin.id,
            'username': admin.username,
            'email': admin.email
        },
        'mensagem': 'Login realizado com sucesso'
    })

@app.route('/api/admin/verify', methods=['GET'])
@admin_required
def admin_verify():
    token = request.headers.get('Authorization')[7:]  # Remove 'Bearer '
    admin_id = verificar_token(token)
    admin = Administrador.query.get(admin_id)
    
    return jsonify({
        'admin': {
            'id': admin.id,
            'username': admin.username,
            'email': admin.email
        },
        'valido': True
    })

@app.route('/api/admin/produtos', methods=['POST'])
@admin_required
def criar_produto():
    data = request.get_json()
    
    if not all(key in data for key in ['nome', 'descricao', 'preco', 'categoria_id']):
        return jsonify({'erro': 'Dados obrigatórios: nome, descricao, preco, categoria_id'}), 400
    
    categoria = Categoria.query.get(data['categoria_id'])
    if not categoria:
        return jsonify({'erro': 'Categoria não encontrada'}), 404
    
    produto = Produto(
        nome=data['nome'],
        descricao=data['descricao'],
        preco=float(data['preco']),
        estoque=data.get('estoque', 0),
        imagem_url=data.get('imagem_url', ''),
        categoria_id=data['categoria_id'],
        ativo=data.get('ativo', True)
    )
    
    db.session.add(produto)
    db.session.commit()
    
    return jsonify({
        'id': produto.id,
        'mensagem': 'Produto criado com sucesso',
        'produto': {
            'id': produto.id,
            'nome': produto.nome,
            'descricao': produto.descricao,
            'preco': produto.preco,
            'estoque': produto.estoque,
            'imagem_url': produto.imagem_url,
            'categoria_id': produto.categoria_id,
            'ativo': produto.ativo
        }
    })

@app.route('/api/admin/produtos/<int:produto_id>', methods=['PUT'])
@admin_required
def atualizar_produto(produto_id):
    produto = Produto.query.get_or_404(produto_id)
    data = request.get_json()
    
    if 'nome' in data:
        produto.nome = data['nome']
    if 'descricao' in data:
        produto.descricao = data['descricao']
    if 'preco' in data:
        produto.preco = float(data['preco'])
    if 'estoque' in data:
        produto.estoque = data['estoque']
    if 'imagem_url' in data:
        produto.imagem_url = data['imagem_url']
    if 'categoria_id' in data:
        categoria = Categoria.query.get(data['categoria_id'])
        if not categoria:
            return jsonify({'erro': 'Categoria não encontrada'}), 404
        produto.categoria_id = data['categoria_id']
    if 'ativo' in data:
        produto.ativo = data['ativo']
    
    db.session.commit()
    
    return jsonify({
        'mensagem': 'Produto atualizado com sucesso',
        'produto': {
            'id': produto.id,
            'nome': produto.nome,
            'descricao': produto.descricao,
            'preco': produto.preco,
            'estoque': produto.estoque,
            'imagem_url': produto.imagem_url,
            'categoria_id': produto.categoria_id,
            'ativo': produto.ativo
        }
    })

@app.route('/api/admin/produtos/<int:produto_id>', methods=['DELETE'])
@admin_required
def deletar_produto(produto_id):
    produto = Produto.query.get_or_404(produto_id)
    
    itens_pedido = ItemPedido.query.filter_by(produto_id=produto_id).count()
    if itens_pedido > 0:
        return jsonify({'erro': 'Não é possível deletar produto que possui pedidos associados'}), 400
    
    db.session.delete(produto)
    db.session.commit()
    
    return jsonify({'mensagem': 'Produto deletado com sucesso'})

@app.route('/api/admin/categorias', methods=['POST'])
@admin_required
def criar_categoria():
    data = request.get_json()
    
    if not all(key in data for key in ['nome']):
        return jsonify({'erro': 'Nome da categoria é obrigatório'}), 400
    
    categoria = Categoria(
        nome=data['nome'],
        descricao=data.get('descricao', '')
    )
    
    db.session.add(categoria)
    db.session.commit()
    
    return jsonify({
        'id': categoria.id,
        'mensagem': 'Categoria criada com sucesso',
        'categoria': {
            'id': categoria.id,
            'nome': categoria.nome,
            'descricao': categoria.descricao
        }
    })

# ==================== ROTAS DE USUÁRIOS ====================

@app.route('/api/usuarios/cadastro', methods=['POST'])
def cadastrar_usuario():
    """Cadastrar novo usuário"""
    data = request.get_json()
    
    required_fields = ['nome', 'email', 'senha']
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({'erro': f'Campo obrigatório: {field}'}), 400
    
    if Usuario.query.filter_by(email=data['email']).first():
        return jsonify({'erro': 'Email já cadastrado'}), 400
    
    try:
        senha_hash = hashlib.sha256(data['senha'].encode()).hexdigest()
        
        usuario = Usuario(
            nome=data['nome'],
            email=data['email'],
            telefone=data.get('telefone', ''),
            endereco=data.get('endereco', ''),
            senha_hash=senha_hash,
            data_nascimento=datetime.strptime(data['data_nascimento'], '%Y-%m-%d').date() if data.get('data_nascimento') else None,
            genero=data.get('genero', ''),
            avatar_url=data.get('avatar_url', '')
        )
        
        db.session.add(usuario)
        db.session.commit()
        
        return jsonify({
            'id': usuario.id,
            'mensagem': 'Usuário cadastrado com sucesso',
            'usuario': {
                'id': usuario.id,
                'nome': usuario.nome,
                'email': usuario.email,
                'telefone': usuario.telefone,
                'endereco': usuario.endereco,
                'data_criacao': usuario.data_criacao.isoformat()
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': f'Erro ao cadastrar usuário: {str(e)}'}), 500

@app.route('/api/usuarios/login', methods=['POST'])
def login_usuario():
    """Login de usuário"""
    data = request.get_json()
    
    if not data.get('email') or not data.get('senha'):
        return jsonify({'erro': 'Email e senha são obrigatórios'}), 400
    
    try:
        usuario = Usuario.query.filter_by(email=data['email']).first()
        
        if not usuario:
            return jsonify({'erro': 'Usuário não encontrado'}), 404
        
        if not usuario.ativo:
            return jsonify({'erro': 'Usuário inativo'}), 403
        
        senha_hash = hashlib.sha256(data['senha'].encode()).hexdigest()
        if usuario.senha_hash != senha_hash:
            return jsonify({'erro': 'Senha incorreta'}), 401
        
        token = create_access_token(
            identity=str(usuario.id),
            additional_claims={
            'email': usuario.email,
                'is_admin': usuario.is_admin
            }
        )
        
        return jsonify({
            'token': token,
            'usuario': {
                'id': usuario.id,
                'nome': usuario.nome,
                'email': usuario.email,
                'telefone': usuario.telefone,
                'endereco': usuario.endereco,
                'is_admin': usuario.is_admin,
                'data_criacao': usuario.data_criacao.isoformat()
            }
        })
        
    except Exception as e:
        return jsonify({'erro': f'Erro ao fazer login: {str(e)}'}), 500

@app.route('/api/usuarios/perfil', methods=['GET'])
@jwt_required()
def obter_perfil():
    """Obter perfil do usuário logado"""
    try:
        current_user_id = get_jwt_identity()
        
        if isinstance(current_user_id, str):
            current_user_id = int(current_user_id) if current_user_id.isdigit() else None
        
        if not current_user_id:
            return jsonify({'erro': 'Token inválido'}), 401
        usuario = Usuario.query.get(current_user_id)
        
        if not usuario:
            return jsonify({'erro': 'Usuário não encontrado'}), 404
        
        return jsonify({
            'id': usuario.id,
            'nome': usuario.nome,
            'email': usuario.email,
            'telefone': usuario.telefone,
            'endereco': usuario.endereco,
            'data_nascimento': usuario.data_nascimento.isoformat() if usuario.data_nascimento else None,
            'genero': usuario.genero,
            'avatar_url': usuario.avatar_url,
            'data_criacao': usuario.data_criacao.isoformat(),
            'is_admin': usuario.is_admin
        })
        
    except Exception as e:
        return jsonify({'erro': f'Erro ao obter perfil: {str(e)}'}), 500

@app.route('/api/usuarios/perfil', methods=['PUT'])
@jwt_required()
def atualizar_perfil():
    """Atualizar perfil do usuário"""
    try:
        current_user_id = get_jwt_identity()
        try:
            current_user_id = int(current_user_id) if current_user_id is not None else None
        except (TypeError, ValueError):
            return jsonify({'erro': 'Token inválido'}), 401
        usuario = Usuario.query.get(current_user_id)
        
        if not usuario:
            return jsonify({'erro': 'Usuário não encontrado'}), 404
        
        data = request.get_json()
        
        if 'nome' in data:
            usuario.nome = data['nome']
        if 'telefone' in data:
            usuario.telefone = data['telefone']
        if 'endereco' in data:
            usuario.endereco = data['endereco']
        if 'data_nascimento' in data:
            usuario.data_nascimento = datetime.strptime(data['data_nascimento'], '%Y-%m-%d').date() if data['data_nascimento'] else None
        if 'genero' in data:
            usuario.genero = data['genero']
        if 'avatar_url' in data:
            usuario.avatar_url = data['avatar_url']
        
        db.session.commit()
        
        return jsonify({
            'mensagem': 'Perfil atualizado com sucesso',
            'usuario': {
                'id': usuario.id,
                'nome': usuario.nome,
                'email': usuario.email,
                'telefone': usuario.telefone,
                'endereco': usuario.endereco,
                'data_nascimento': usuario.data_nascimento.isoformat() if usuario.data_nascimento else None,
                'genero': usuario.genero,
                'avatar_url': usuario.avatar_url
            }
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': f'Erro ao atualizar perfil: {str(e)}'}), 500

@app.route('/api/usuarios/historico', methods=['GET'])
@jwt_required()
def obter_historico_compras():
    """Obter histórico de compras do usuário"""
    try:
        # Obter o identity do JWT
        current_user_id = get_jwt_identity()
        print(f"DEBUG: User ID recebido: {current_user_id}, tipo: {type(current_user_id)}")
        
        # Converter para int se for string
        if isinstance(current_user_id, str):
            current_user_id = int(current_user_id) if current_user_id.isdigit() else None
        
        if not current_user_id:
            print("DEBUG: Token inválido - current_user_id é None")
            return jsonify({'erro': 'Token inválido'}), 401
        
        print(f"DEBUG: Buscando pedidos para usuário ID: {current_user_id}")
        pedidos = Pedido.query.filter_by(usuario_id=current_user_id).order_by(Pedido.data_pedido.desc()).all()
        print(f"DEBUG: Encontrados {len(pedidos)} pedidos")
        
        historico = []
        for pedido in pedidos:
            itens_data = []
            for item in pedido.itens:
                try:
                    produto_nome = item.produto.nome if item.produto else 'Produto removido'
                    produto_imagem = item.produto.imagem_url if item.produto else ''
                except Exception as e:
                    print(f"DEBUG: Erro ao obter produto do item {item.id}: {e}")
                    produto_nome = 'Produto removido'
                    produto_imagem = ''
                
                itens_data.append({
                    'id': item.id,
                    'produto_id': item.produto_id,
                    'produto_nome': produto_nome,
                    'produto_imagem': produto_imagem,
                    'quantidade': item.quantidade,
                    'preco_unitario': item.preco_unitario
                })
            
            historico.append({
                'id': pedido.id,
                'total': pedido.total,
                'status': pedido.status,
                'data_pedido': pedido.data_pedido.isoformat(),
                'data_atualizacao': pedido.data_atualizacao.isoformat(),
                'itens': itens_data
            })
        
        print(f"DEBUG: Retornando histórico com {len(historico)} pedidos")
        return jsonify(historico)
        
    except Exception as e:
        print(f"DEBUG: Erro ao obter histórico: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'erro': f'Erro ao obter histórico: {str(e)}'}), 500

# ==================== ROTAS DE FAVORITOS ====================

@app.route('/api/favoritos', methods=['GET'])
@jwt_required()
def obter_favoritos():
    """Obter lista de favoritos do usuário"""
    try:
        current_user_id = get_jwt_identity()
        try:
            current_user_id = int(current_user_id) if current_user_id is not None else None
        except (TypeError, ValueError):
            return jsonify({'erro': 'Token inválido'}), 401
        if not current_user_id:
            return jsonify({'erro': 'Token inválido'}), 401
        
        favoritos = Favorito.query.filter_by(usuario_id=current_user_id).order_by(Favorito.data_favorito.desc()).all()
        
        favoritos_data = []
        for favorito in favoritos:
            if favorito.produto:  
                favoritos_data.append({
                    'id': favorito.id,
                    'produto_id': favorito.produto_id,
                    'produto_nome': favorito.produto.nome,
                    'produto_preco': favorito.produto.preco,
                    'produto_imagem': favorito.produto.imagem_url,
                    'produto_estoque': favorito.produto.estoque,
                    'data_favorito': favorito.data_favorito.isoformat()
                })
        
        return jsonify(favoritos_data)
        
    except Exception as e:
        return jsonify({'erro': f'Erro ao obter favoritos: {str(e)}'}), 500

@app.route('/api/favoritos', methods=['POST'])
@jwt_required()
def adicionar_favorito():
    """Adicionar produto aos favoritos"""
    try:
        current_user_id = get_jwt_identity()
        try:
            current_user_id = int(current_user_id) if current_user_id is not None else None
        except (TypeError, ValueError):
            return jsonify({'erro': 'Token inválido'}), 401
        data = request.get_json()
        
        if 'produto_id' not in data:
            return jsonify({'erro': 'ID do produto é obrigatório'}), 400
        
        produto_id = data['produto_id']
        
        produto = Produto.query.get(produto_id)
        if not produto:
            return jsonify({'erro': 'Produto não encontrado'}), 404
        
        favorito_existente = Favorito.query.filter_by(
            usuario_id=current_user_id,
            produto_id=produto_id
        ).first()
        
        if favorito_existente:
            return jsonify({'erro': 'Produto já está nos favoritos'}), 400
        
        favorito = Favorito(
            usuario_id=current_user_id,
            produto_id=produto_id
        )
        
        db.session.add(favorito)
        db.session.commit()
        
        return jsonify({
            'mensagem': 'Produto adicionado aos favoritos',
            'favorito': {
                'id': favorito.id,
                'produto_id': favorito.produto_id,
                'data_favorito': favorito.data_favorito.isoformat()
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': f'Erro ao adicionar favorito: {str(e)}'}), 500

@app.route('/api/favoritos/<int:produto_id>', methods=['DELETE'])
@jwt_required()
def remover_favorito(produto_id):
    """Remover produto dos favoritos"""
    try:
        current_user_id = get_jwt_identity()
        try:
            current_user_id = int(current_user_id) if current_user_id is not None else None
        except (TypeError, ValueError):
            return jsonify({'erro': 'Token inválido'}), 401
        
        favorito = Favorito.query.filter_by(
            usuario_id=current_user_id,
            produto_id=produto_id
        ).first()
        
        if not favorito:
            return jsonify({'erro': 'Favorito não encontrado'}), 404
        
        db.session.delete(favorito)
        db.session.commit()
        
        return jsonify({'mensagem': 'Produto removido dos favoritos'})
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': f'Erro ao remover favorito: {str(e)}'}), 500

@app.route('/api/favoritos/<int:produto_id>/status', methods=['GET'])
@jwt_required()
def verificar_favorito(produto_id):
    """Verificar se produto está nos favoritos"""
    try:
        current_user_id = get_jwt_identity()
        try:
            current_user_id = int(current_user_id) if current_user_id is not None else None
        except (TypeError, ValueError):
            return jsonify({'erro': 'Token inválido'}), 401
        
        favorito = Favorito.query.filter_by(
            usuario_id=current_user_id,
            produto_id=produto_id
        ).first()
        
        return jsonify({'is_favorito': favorito is not None})
        
    except Exception as e:
        return jsonify({'erro': f'Erro ao verificar favorito: {str(e)}'}), 500

# ==================== ROTAS DE PEDIDOS ====================

@app.route('/api/pedidos', methods=['POST'])
def criar_pedido():
    """Criar um novo pedido"""
    data = request.get_json()
    
    if not data:
        return jsonify({'erro': 'Dados não fornecidos'}), 400
    
    required_fields = ['itens', 'total', 'nome_cliente', 'email_cliente', 'telefone_cliente', 'endereco_entrega', 'cidade_entrega', 'cep_entrega']
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({'erro': f'Campo obrigatório: {field}'}), 400
    
    try:
        # Verificar se há token no header
        current_user_id = None
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header[7:]
            try:
                from flask_jwt_extended import decode_token
                # Tentar decodificar o token
                token_data = decode_token(token)
                current_user_id = token_data.get('sub')
                if current_user_id:
                    current_user_id = int(current_user_id) if str(current_user_id).isdigit() else None
            except:
                pass  # Token inválido ou expirado, cria pedido sem usuário  
        
        pedido = Pedido(
            usuario_id=current_user_id,  
            total=float(data['total']),
            nome_cliente=data['nome_cliente'],
            email_cliente=data['email_cliente'],
            telefone_cliente=data['telefone_cliente'],
            endereco_entrega=data['endereco_entrega'],
            cidade_entrega=data['cidade_entrega'],
            cep_entrega=data['cep_entrega'],
            observacoes=data.get('observacoes', ''),
            status='pendente'
        )
        
        db.session.add(pedido)
        db.session.flush()  
        
        for item_data in data['itens']:
            item_pedido = ItemPedido(
                pedido_id=pedido.id,
                produto_id=item_data['produto_id'],
                quantidade=item_data['quantidade'],
                preco_unitario=item_data['preco']
            )
            db.session.add(item_pedido)
        
        db.session.commit()
        
        return jsonify({
            'id': pedido.id,
            'mensagem': 'Pedido criado com sucesso',
            'pedido': {
                'id': pedido.id,
                'total': pedido.total,
                'status': pedido.status,
                'data_pedido': pedido.data_pedido.isoformat()
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': f'Erro ao criar pedido: {str(e)}'}), 500

@app.route('/api/pedidos', methods=['GET'])
def listar_pedidos():
    """Listar todos os pedidos (para admin)"""
    try:
        pedidos = Pedido.query.order_by(Pedido.data_pedido.desc()).all()
        
        pedidos_data = []
        for pedido in pedidos:
            pedidos_data.append({
                'id': pedido.id,
                'total': pedido.total,
                'status': pedido.status,
                'data_pedido': pedido.data_pedido.isoformat(),
                'data_atualizacao': pedido.data_atualizacao.isoformat(),
                'nome_cliente': pedido.nome_cliente,
                'email_cliente': pedido.email_cliente,
                'telefone_cliente': pedido.telefone_cliente,
                'endereco_entrega': pedido.endereco_entrega,
                'cidade_entrega': pedido.cidade_entrega,
                'cep_entrega': pedido.cep_entrega,
                'observacoes': pedido.observacoes,
                'itens': [{
                    'id': item.id,
                    'produto_id': item.produto_id,
                    'quantidade': item.quantidade,
                    'preco_unitario': item.preco_unitario,
                    'produto_nome': item.produto.nome if item.produto else 'Produto removido'
                } for item in pedido.itens]
            })
        
        return jsonify(pedidos_data)
        
    except Exception as e:
        return jsonify({'erro': f'Erro ao listar pedidos: {str(e)}'}), 500

@app.route('/api/pedidos/<int:pedido_id>', methods=['GET'])
def obter_pedido(pedido_id):
    """Obter detalhes de um pedido específico"""
    try:
        pedido = Pedido.query.get_or_404(pedido_id)
        
        return jsonify({
            'id': pedido.id,
            'total': pedido.total,
            'status': pedido.status,
            'data_pedido': pedido.data_pedido.isoformat(),
            'data_atualizacao': pedido.data_atualizacao.isoformat(),
            'nome_cliente': pedido.nome_cliente,
            'email_cliente': pedido.email_cliente,
            'telefone_cliente': pedido.telefone_cliente,
            'endereco_entrega': pedido.endereco_entrega,
            'cidade_entrega': pedido.cidade_entrega,
            'cep_entrega': pedido.cep_entrega,
            'observacoes': pedido.observacoes,
            'itens': [{
                'id': item.id,
                'produto_id': item.produto_id,
                'quantidade': item.quantidade,
                'preco_unitario': item.preco_unitario,
                'produto_nome': item.produto.nome if item.produto else 'Produto removido',
                'produto_imagem': item.produto.imagem_url if item.produto else ''
            } for item in pedido.itens]
        })
        
    except Exception as e:
        return jsonify({'erro': f'Erro ao obter pedido: {str(e)}'}), 500

@app.route('/api/admin/pedidos/<int:pedido_id>/status', methods=['PUT'])
@admin_required
def atualizar_status_pedido(pedido_id):
    """Atualizar status de um pedido (apenas admin)"""
    data = request.get_json()
    
    if 'status' not in data:
        return jsonify({'erro': 'Status é obrigatório'}), 400
    
    status_validos = ['pendente', 'processando', 'enviado', 'entregue', 'cancelado']
    if data['status'] not in status_validos:
        return jsonify({'erro': f'Status inválido. Use: {", ".join(status_validos)}'}), 400
    
    try:
        pedido = Pedido.query.get_or_404(pedido_id)
        pedido.status = data['status']
        pedido.data_atualizacao = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'id': pedido.id,
            'status': pedido.status,
            'data_atualizacao': pedido.data_atualizacao.isoformat(),
            'mensagem': f'Status atualizado para: {pedido.status}'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': f'Erro ao atualizar status: {str(e)}'}), 500

@app.route('/api/admin/usuarios', methods=['GET'])
@admin_required
def listar_usuarios():
    """Listar todos os usuários (apenas admin)"""
    try:
        usuarios = Usuario.query.order_by(Usuario.data_criacao.desc()).all()
        
        usuarios_data = []
        for usuario in usuarios:
            # Contar pedidos do usuário
            total_pedidos = Pedido.query.filter_by(usuario_id=usuario.id).count()
            
            usuarios_data.append({
                'id': usuario.id,
                'nome': usuario.nome,
                'email': usuario.email,
                'telefone': usuario.telefone,
                'endereco': usuario.endereco,
                'is_admin': usuario.is_admin,
                'data_criacao': usuario.data_criacao.isoformat() if usuario.data_criacao else None,
                'data_nascimento': usuario.data_nascimento.isoformat() if usuario.data_nascimento else None,
                'genero': usuario.genero,
                'avatar_url': usuario.avatar_url,
                'ativo': usuario.ativo,
                'total_pedidos': total_pedidos
            })
        
        return jsonify(usuarios_data)
        
    except Exception as e:
        return jsonify({'erro': f'Erro ao listar usuários: {str(e)}'}), 500

@app.route('/api/admin/usuarios/<int:usuario_id>/ativo', methods=['PUT'])
@admin_required
def atualizar_status_usuario(usuario_id):
    """Atualizar status ativo/inativo de um usuário (apenas admin)"""
    data = request.get_json()
    
    if 'ativo' not in data:
        return jsonify({'erro': 'Campo ativo é obrigatório'}), 400
    
    try:
        usuario = Usuario.query.get_or_404(usuario_id)
        usuario.ativo = data['ativo']
        
        db.session.commit()
        
        return jsonify({
            'id': usuario.id,
            'ativo': usuario.ativo,
            'mensagem': f'Usuário {"ativado" if usuario.ativo else "desativado"} com sucesso'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': f'Erro ao atualizar status do usuário: {str(e)}'}), 500

@app.route('/api/admin/pedidos/estatisticas', methods=['GET'])
@admin_required
def estatisticas_pedidos():
    """Obter estatísticas dos pedidos (apenas admin)"""
    try:
        total_pedidos = Pedido.query.count()
        pedidos_pendentes = Pedido.query.filter_by(status='pendente').count()
        pedidos_processando = Pedido.query.filter_by(status='processando').count()
        pedidos_enviados = Pedido.query.filter_by(status='enviado').count()
        pedidos_entregues = Pedido.query.filter_by(status='entregue').count()
        
        # Calcular faturamento total
        faturamento_total = db.session.query(db.func.sum(Pedido.total)).filter(
            Pedido.status.in_(['entregue', 'enviado', 'processando'])
        ).scalar() or 0
        
        # Pedidos por status
        status_counts = {
            'pendente': pedidos_pendentes,
            'processando': pedidos_processando,
            'enviado': pedidos_enviados,
            'entregue': pedidos_entregues
        }
        
        return jsonify({
            'total_pedidos': total_pedidos,
            'faturamento_total': float(faturamento_total),
            'status_counts': status_counts,
            'pedidos_recentes': [
                {
                    'id': p.id,
                    'total': p.total,
                    'status': p.status,
                    'data_pedido': p.data_pedido.isoformat(),
                    'nome_cliente': p.nome_cliente
                } for p in Pedido.query.order_by(Pedido.data_pedido.desc()).limit(5).all()
            ]
        })
        
    except Exception as e:
        return jsonify({'erro': f'Erro ao obter estatísticas: {str(e)}'}), 500

# Função para popular o banco com dados iniciais (fallback)
def popular_banco_fallback():
    """Popula o banco com dados básicos caso a API externa falhe"""
    # Criar categorias básicas
    categorias = [
        Categoria(nome='Eletrônicos', descricao='Smartphones, tablets e acessórios'),
        Categoria(nome='Roupas', descricao='Moda masculina e feminina'),
        Categoria(nome='Casa e Jardim', descricao='Decoração e utilidades domésticas'),
        Categoria(nome='Esportes', descricao='Equipamentos e roupas esportivas')
    ]
    
    for cat in categorias:
        db.session.add(cat)
    
    db.session.commit()

def criar_admin_padrao():
    """Cria um administrador padrão se não existir nenhum"""
    if Administrador.query.count() == 0:
        admin = Administrador(
            username='admin',
            email='admin@loja.com',
            senha_hash=hash_senha('admin123'),
            ativo=True
        )
        db.session.add(admin)
        db.session.commit()
        print("👤 Administrador padrão criado:")
        print("   Username: admin")
        print("   Senha: admin123")
        print("   ⚠️  ALTERE A SENHA APÓS O PRIMEIRO LOGIN!")

def inicializar_banco():
    """Inicializa o banco de dados e popula com dados iniciais"""
    try:
        with app.app_context():
            db.create_all()
            criar_admin_padrao()
            
            if Categoria.query.count() == 0:
                print("🔄 Carregando produtos em português...")
                if sincronizar_produtos_portugues():
                    print("✅ Produtos em português carregados com sucesso!")
                    print(f"📦 Total: {len(PRODUTOS_PORTUGUES)} produtos")
                    print("💰 Valores em meticais (MZN)")
                else:
                    print("⚠️ Falha no carregamento. Usando dados básicos...")
                    popular_banco_fallback()
    except Exception as e:
        print(f"⚠️ Erro ao inicializar banco: {e}")
        import traceback
        traceback.print_exc()

# Inicializar banco quando o módulo for importado (para gunicorn no Render)
# Isso garante que o banco seja criado mesmo quando não executamos python app.py diretamente
try:
    inicializar_banco()
except Exception as e:
    print(f"⚠️ Aviso na inicialização: {e}")

if __name__ == '__main__':
    # Para desenvolvimento local
    # Porta do ambiente ou padrão
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') != 'production'
    
    app.run(debug=debug, host='0.0.0.0', port=port)