using System;

class Calculadora
{
    static void Main()
    {
        while (true)
        {
            Console.Clear();
            Console.WriteLine("==== CALCULADORA ====");
            Console.WriteLine("1 - Somar");
            Console.WriteLine("2 - Subtrair");
            Console.WriteLine("3 - Multiplicar");
            Console.WriteLine("4 - Dividir");
            Console.WriteLine("5 - Resto da Divisão");
            Console.WriteLine("6 - Potenciação (base^expoente)");
            Console.WriteLine("0 - Sair");
            Console.Write("Escolha uma opção: ");

            string opc = Console.ReadLine()?.Trim();
            if (opc == "0") break;

            if (!"123456".Contains(opc))
            {
                Console.WriteLine("Opção inválida. Pressione Enter para voltar ao menu.");
                Console.ReadLine();
                continue;
            }

            // Ler dois valores com validação
            double a = LerDouble("Digite o primeiro valor: ");
            double b = LerDouble("Digite o segundo valor: ");

            switch (opc)
            {
                case "1":
                    Console.WriteLine($"\nResultado: {a} + {b} = {a + b}");
                    break;
                case "2":
                    Console.WriteLine($"\nResultado: {a} - {b} = {a - b}");
                    break;
                case "3":
                    Console.WriteLine($"\nResultado: {a} * {b} = {a * b}");
                    break;
                case "4":
                    if (Math.Abs(b) < double.Epsilon)
                        Console.WriteLine("\nNão é possível dividir por zero.");
                    else
                        Console.WriteLine($"\nResultado: {a} / {b} = {a / b}");
                    break;
                case "5":
                    if (Math.Abs(b) < double.Epsilon)
                        Console.WriteLine("\nNão é possível dividir por zero.");
                    else
                        Console.WriteLine($"\nResultado (resto): {a} % {b} = {a % b}");
                    break;
                case "6":
                    // potenciação: a^b
                    double pow = Math.Pow(a, b);
                    Console.WriteLine($"\nResultado: {a}^{b} = {pow}");
                    break;
            }

            Console.WriteLine("\nPressione Enter para voltar ao menu...");
            Console.ReadLine();
        }

        Console.WriteLine("Saindo... Até logo!");
    }

    static double LerDouble(string prompt)
    {
        double valor;
        Console.Write(prompt);
        while (!double.TryParse(Console.ReadLine()?.Replace(',', '.'), System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out valor))
        {
            Console.Write("Entrada inválida. Digite um número válido: ");
        }
        return valor;
    }
}
