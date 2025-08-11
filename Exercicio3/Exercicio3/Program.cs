using System;

class DroneControle
{
    static void Main()
    {
        double altura = 0.5;
        int direcao = 0;
        double velocidade = 0;
        bool proximoObjeto = false;

        while (true)
        {
            Console.Clear();
            Console.WriteLine("=== CONTROLE DE DRONE ===");
            Console.WriteLine($"Altura: {altura} m | Direção: {direcao}° | Velocidade: {velocidade} m/s | Próximo objeto: {proximoObjeto}");
            Console.WriteLine("1 - Definir altura");
            Console.WriteLine("2 - Subir 0,5 m");
            Console.WriteLine("3 - Descer 0,5 m");
            Console.WriteLine("4 - Definir direção");
            Console.WriteLine("5 - Girar esquerda 5°");
            Console.WriteLine("6 - Girar direita 5°");
            Console.WriteLine("7 - Aumentar velocidade 0,5 m/s");
            Console.WriteLine("8 - Diminuir velocidade 0,5 m/s");
            Console.WriteLine("9 - Aproximar de objeto");
            Console.WriteLine("10 - Afastar de objeto");
            Console.WriteLine("0 - Sair");
            Console.Write("Escolha: ");

            string opc = Console.ReadLine();

            switch (opc)
            {
                case "1":
                    double novaAltura = LerDouble("Nova altura (0,5 a 25): ");
                    if (novaAltura >= 0.5 && novaAltura <= 25 && !proximoObjeto)
                        altura = novaAltura;
                    else
                        Console.WriteLine("Altura inválida ou impossibilitada.");
                    break;

                case "2":
                    if (altura + 0.5 <= 25 && !proximoObjeto) altura += 0.5;
                    break;

                case "3":
                    if (altura - 0.5 >= 0.5 && !proximoObjeto) altura -= 0.5;
                    break;

                case "4":
                    int novaDirecao = (int)LerDouble("Nova direção (0 a 360): ");
                    direcao = ((novaDirecao % 360) + 360) % 360;
                    break;

                case "5":
                    direcao = (direcao - 5 + 360) % 360;
                    break;

                case "6":
                    direcao = (direcao + 5) % 360;
                    break;

                case "7":
                    if (velocidade + 0.5 <= 15) velocidade += 0.5;
                    break;

                case "8":
                    if (velocidade - 0.5 >= 0) velocidade -= 0.5;
                    break;

                case "9":
                    if (velocidade == 0 && !proximoObjeto)
                        proximoObjeto = true;
                    else
                        Console.WriteLine("Não é possível aproximar agora (pare antes e não estar já próximo).");
                    break;

                case "10":
                    proximoObjeto = false;
                    break;

                case "0":
                    return;

                default:
                    Console.WriteLine("Opção inválida!");
                    break;
            }

            Console.WriteLine("\nPressione Enter para continuar...");
            Console.ReadLine();
        }
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
