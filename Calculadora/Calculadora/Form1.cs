using System;
using System.Windows.Forms;

namespace Calculadora
{
    public partial class Form1 : Form
    {
        // Variáveis da calculadora
        private double valor1 = 0;
        private double valor2 = 0;
        private string operacao = "";
        private bool operacaoRealizada = false;

        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {

            textBox1.Text = "0";
        }


        private void button1_Click(object sender, EventArgs e)
        {
            AdicionarNumero("1");
        }

        private void button2_Click(object sender, EventArgs e)
        {
            AdicionarNumero("2");
        }

        private void button3_Click(object sender, EventArgs e)
        {
            AdicionarNumero("3");
        }

        private void button4_Click(object sender, EventArgs e)
        {
            AdicionarNumero("4");
        }

        private void button5_Click(object sender, EventArgs e)
        {
            AdicionarNumero("5");
        }

        private void button6_Click(object sender, EventArgs e)
        {
            AdicionarNumero("6");
        }

        private void button7_Click(object sender, EventArgs e)
        {
            AdicionarNumero("7");
        }

        private void button8_Click(object sender, EventArgs e)
        {
            AdicionarNumero("8");
        }

        private void button9_Click(object sender, EventArgs e)
        {
            AdicionarNumero("9");
        }

        private void button0_Click(object sender, EventArgs e)
        {
            AdicionarNumero("0");
        }


        private void AdicionarNumero(string numero)
        {
            if (textBox1.Text == "0" || operacaoRealizada)
            {
                textBox1.Text = numero;
                operacaoRealizada = false;
            }
            else
            {
                textBox1.Text += numero;
            }
        }


        private void adicao(object sender, EventArgs e)
        {
            RealizarOperacao("+");
        }

        private void subtracao(object sender, EventArgs e)
        {
            RealizarOperacao("-");
        }

        private void multiplicacao(object sender, EventArgs e)
        {
            RealizarOperacao("*");
        }

        private void divisao(object sender, EventArgs e)
        {
            RealizarOperacao("/");
        }


        private void RealizarOperacao(string op)
        {
            if (valor1 != 0 && !operacaoRealizada)
            {
                igual(null, null);
            }

            valor1 = Convert.ToDouble(textBox1.Text);
            operacao = op;
            operacaoRealizada = true;
        }


        private void igual(object sender, EventArgs e)
        {
            if (operacao != "")
            {
                valor2 = Convert.ToDouble(textBox1.Text);
                double resultado = 0;

                switch (operacao)
                {
                    case "+":
                        resultado = valor1 + valor2;
                        break;
                    case "-":
                        resultado = valor1 - valor2;
                        break;
                    case "*":
                        resultado = valor1 * valor2;
                        break;
                    case "/":
                        if (valor2 != 0)
                        {
                            resultado = valor1 / valor2;
                        }
                        else
                        {
                            MessageBox.Show("Erro: Divisão por zero não é permitida!", "Erro",
                                          MessageBoxButtons.OK, MessageBoxIcon.Error);
                            limpar(null, null);
                            return;
                        }
                        break;
                }

                textBox1.Text = resultado.ToString();
                valor1 = resultado;
                operacao = "";
                operacaoRealizada = true;
            }
        }


        private void limpar(object sender, EventArgs e)
        {
            textBox1.Text = "0";
            valor1 = 0;
            valor2 = 0;
            operacao = "";
            operacaoRealizada = false;
        }


        private void display(object sender, EventArgs e)
        {

        }

        private void textBox1_TextChanged(object sender, EventArgs e)
        {

        }
    }
}