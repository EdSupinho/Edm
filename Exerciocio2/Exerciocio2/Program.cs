using System;
using System.Linq;

class ListaNumeros
{
    static void Main()
    {
        Console.WriteLine("=== SOMA E MÉDIA DE NÚMEROS ===");

        int qtd;
        Console.Write("Quantos números deseja informar (3 a 10)? ");
        while (!int.TryParse(Console.ReadLine(), out qtd) || qtd < 3 || qtd > 10)
        {
            Console.Write("Valor inválido. Digite um número entre 3 e 10: ");
        }

        double[] numeros = new double[qtd];

        for (int i = 0; i < qtd; i++)
        {
            numeros[i] = LerDouble($"Digite o {i + 1}º número: ");
        }

        double soma = numeros.Sum();
        double media = numeros.Average();

        Console.WriteLine($"\nSoma: {soma}");
        Console.WriteLine($"Média: {media}");

        Console.WriteLine("\nPressione Enter para sair...");
        Console.ReadLine();
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
